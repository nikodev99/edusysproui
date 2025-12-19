import {useEffect, useState} from "react";
import {LoginRequest, toUser, UserProfile, UserProfileToken} from "@/auth/dto/user.ts";
import LocalStorageManager from "@/core/LocalStorageManager.ts";
import {loginApi, logoutApi, signupApi, tokenRefresh, assignToUser} from "@/auth/services/AuthService.ts.tsx";
import {UserContext, UserContextProps} from "@/context/UserContext.ts";
import {jwtTokenManager} from "@/auth/jwt/JWTToken.ts";
import {loggedUser} from "@/auth/jwt/LoggedUser.ts";
import {School} from "@/entity";
import {AssignUserToSchoolSchema, SignupSchema} from "@/schema";
import {isAxiosError} from "axios";
import {useUserRepo} from "@/hooks/actions/useUserRepo.ts";
import {useQueryClient} from "@tanstack/react-query";

export const UserProvider = ({children}: UserContextProps) => {
    const {saveActivity} = useUserRepo()

    const [token, setToken] = useState<string | null>(null)
    const [refreshToken, setRefreshToken] = useState<string | null>(null)
    const [user, setUser] = useState<UserProfile | null>(null)
    const [isReady, setIsReady] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [userSchool, setUserSchool] = useState<School | null>(null)
    const [errorType, setErrorType] = useState<string | null>(null)

    const queryClient = useQueryClient()

    useEffect(() => {
        const initAuth = async () => {
            const cachedUser = loggedUser.getUser()
            const token = loggedUser.getToken()
            const refreshToken = loggedUser.getRefreshToken()
            const school = loggedUser.getSchool()

            if (cachedUser && token) {
                const isValidToken = await jwtTokenManager.isValidToken()

                if(isValidToken) {
                    //TODO retrieve an Employee, Teacher or Guardian
                    setUser(cachedUser as UserProfile)
                    setToken(token as string)
                    setRefreshToken(refreshToken as string)
                    setUserSchool(school as School)
                }else {
                    await performLogout(false)
                }
            }
            setIsReady(true)
        }

        initAuth().then()
    }, [])

    const register = (data: SignupSchema) => {
        try {
            return signupApi(data)
        } catch (error) {
            console.error("Error during registration:", error)
            return false
        }
    }

    const assignSchoolToUser = (data: AssignUserToSchoolSchema) => {
        try {
            return assignToUser(data)
        }catch (error) {
            console.error("Error during school assignment:", error)
            return false
        }
    }

    const login = async (data: LoginRequest) => {
        setErrorMessage(null)
        setErrorType(null)
        try {
            const resp = await loginApi(data)

            if (resp && 'status' in resp && resp.status >= 200 && resp.status < 300) {
                if ('data' in resp) {
                    return cashedLoggedUser(resp.data, data.username)
                }
                setErrorMessage("Votre compte n'existe pas")
                return false
            }else {
                setErrorMessage("Username ou mot de passe invalide(s) !")
                return false
            }
        }catch(error) {
            if (isAxiosError(error)) {
                const response = error.response
                if (response && 'status' in response) {
                    setErrorType(response.data?.message)
                    switch (response.status) {
                        case 423:
                            setErrorMessage("Votre compte n'est pas activé. Veuillez contacter l'administrateur pour activer votre compte.")
                            return false
                        case 403:
                            setErrorMessage("Votre compte a été verrouillé. Veuillez contacter l'administrateur pour déverrouiller votre compte.")
                            return false
                        default:
                            setErrorMessage("Username ou mot de passe invalide(s) !")
                            return false
                    }
                }
            }
            setErrorMessage("Une erreur s'est produite lors de la connexion. Veuillez réessayer...")
            return false
        }
    }

    const handleRefreshToken = async () => {
        setErrorMessage(null)
        setErrorType(null)
        try {
            const response = await tokenRefresh()
            if (response && response?.status === 200 && 'data' in response) {
                const success = cashedLoggedUser(response.data, undefined)
                if (success) {
                    jwtTokenManager.clearCache()
                    jwtTokenManager.refreshTokenCache()
                    return true
                }
                return false
            }else {
                setErrorMessage("An error occurred while refreshing your token, please try again...")
                setErrorType("Refresh Error")
                return false
            }
        }catch (error) {
            console.error("Error during token refresh:", error)
            setErrorType("Refresh Error")
            return false
        }
    }

    const isLoggedIn = () => {
        return !!user
    }

    const shouldPickSchools = () => {
        return userSchool === null
    }

    const shouldRedirectToHome = () => {
        return !!userSchool
    }

    /**
     * Enhance the logout function that properly cleans up all authentication states
     * @param callLogoutApi
     */
    const performLogout = async (callLogoutApi: boolean = true) => {
        try {
            if(callLogoutApi) {
                await logoutApi()
            }
        }catch (error) {
            console.error("Error calling logout API:", error)
        }finally {
            loggedUser.removeToken()
            loggedUser.removeRefreshToken()
            loggedUser.removeUser()
            loggedUser.removeSchool()
            loggedUser.clearCache()
            loggedUser.removeRoles()
            LocalStorageManager.remove('lastActivity')

            jwtTokenManager.clearCache()
            LocalStorageManager.clear()
            queryClient.clear()

            setUser(null)
            setToken(null)
            setRefreshToken(null)
            setErrorMessage(null)
            setErrorType(null)
            setUserSchool(null)
        }
    }

    const cashedLoggedUser = (data: UserProfileToken, username?: string) => {
        try {
            // Update storage first
            loggedUser.setToken(data.accessToken)
            loggedUser.setRefreshToken(data.refreshToken)

            const userProfile = toUser(data)
            const schools = userProfile?.schools || []
            const school = schools?.length === 1 ? schools[0] : null
            loggedUser.setUser(userProfile)
            loggedUser.setRoles(userProfile?.roles || [])

            if (school) {
                loggedUser.setSchool(school)
            }else {
                loggedUser.removeSchool()
            }

            // Update React state
            setUser(userProfile)
            setToken(data.accessToken)
            setRefreshToken(data.refreshToken)
            setUserSchool(school)

            //Save the login activity
            if (username)
                saveActivity({
                    accountId: data.accountId,
                    action: 'Login successful with cookie',
                    description: 'Login successful with cookie for ' + username
                }).then(r => r)

            return true
        } catch (error) {
            console.error("Error caching logged user:", error)
            return false
        }
    }

    const logout = () => {
        performLogout().then()
    }

    return (
        <UserContext.Provider value={{
            user,
            token,
            refreshToken,
            userSchool,
            registerUser: register,
            assignUser: assignSchoolToUser,
            loginUser: login,
            refresh: handleRefreshToken,
            logoutUser: logout,
            isLoggedIn: isLoggedIn,
            shouldRedirectToHome: shouldRedirectToHome,
            shouldPickSchool: shouldPickSchools,
            loginError: {type: errorType, message: errorMessage},
            clearLoginError: () => setErrorMessage(null)
        }}>
            {isReady ? children : null}
        </UserContext.Provider>
    )
}