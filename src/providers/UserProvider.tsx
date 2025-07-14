import {useEffect, useState} from "react";
import {LoginRequest, SignupRequest, toUser, UserProfile, UserProfileToken} from "../auth/dto/user.ts";
import LocalStorageManager from "../core/LocalStorageManager.ts";
import {loginApi, logoutApi, signupApi, tokenRefresh} from "../auth/services/AuthService.ts.tsx";
import {message} from "antd";
import {UserContext, UserContextProps} from "../context/UserContext.ts";
import {jwtTokenManager} from "../auth/jwt/JWTToken.tsx";
import {loggedUser} from "../auth/jwt/LoggedUser.ts";
import {School} from "../entity";
import {AxiosResponse} from "axios";

export const UserProvider = ({children}: UserContextProps) => {
    const [token, setToken] = useState<string | null>(null)
    const [refreshToken, setRefreshToken] = useState<string | null>(null)
    const [user, setUser] = useState<UserProfile | null>(null)
    const [isReady, setIsReady] = useState(false)
    const [shouldRedirectToHome, setShouldRedirectToHome] = useState(false)
    const [loginError, setLoginError] = useState<string | null>(null)
    const [userSchool, setUserSchool] = useState<School | null>(null)

    useEffect(() => {
        const initAuth = async () => {
            const cachedUser = loggedUser.getUser()
            const token = loggedUser.getToken()
            const refreshToken = loggedUser.getRefreshToken()

            if (cachedUser && token) {
                const isValidToken = await jwtTokenManager.isValidToken()

                if(isValidToken) {
                    //TODO retrieve an Employee, Teacher or Guardian
                    setUser(cachedUser as UserProfile)
                    setToken(token as string)
                    setRefreshToken(refreshToken as string)
                }else {
                    await performLogout(false)
                }
            }
            setIsReady(true)
        }

        initAuth().then()
    }, [])

    useEffect(() => {
        const initSchool = async () => {
            const school = loggedUser.getSchool()
            if (school) {
                setUserSchool(school)
            }else if (user) {
                const schools = user.schools
                if (Array.isArray(schools) && schools.length === 1) {
                    loggedUser.setSchool(schools[0])
                    setUserSchool(schools[0])
                }
            }
        }
        
        initSchool().then()
    }, [user]);

    const register = async (data: SignupRequest) => {
        try {
            const resp = await signupApi(data)
            if (resp && resp?.status === 200) {
                message.success("Account created successfully, the user can now login...", 5)
                return true
            }
            return false
        } catch (error) {
            message.error("An error occurred while creating your account, please try again...", 5)
            return false
        }
    }

    const login = async (data: LoginRequest) => {
        setLoginError(null)
        try {
            const resp = await loginApi(data)
            if (resp && resp?.status === 200) {
                return cashedLoggedUser(resp)
            }else {
                setLoginError("Username ou mot de passe invalide(s) !")
                return false
            }
        }catch(error) {
            message.error("An error occurred while logging in, please try again...", 5)
            return false
        }
    }

    const handleRefreshToken = async () => {
        setLoginError(null)
        try {
            const response = await tokenRefresh()
            if (response && response?.status === 200) {
                const success = cashedLoggedUser(response)
                if (success) {
                    jwtTokenManager.clearCache()
                    jwtTokenManager.refreshTokenCache()
                    return true
                }
                return false
            }else {
                setLoginError("An error occurred while refreshing your token, please try again...")
                return false
            }
        }catch (error) {
            console.error("Error during token refresh:", error)
            return false
        }
    }

    const isLoggedIn = () => {
        return !!user
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
            LocalStorageManager.remove('lastActivity')

            jwtTokenManager.clearCache()

            setUser(null)
            setToken(null)
            setRefreshToken(null)
            setShouldRedirectToHome(false)
            setLoginError(null)
        }
    }

    const cashedLoggedUser = (resp: AxiosResponse<UserProfileToken>) => {
        try {
            // Update storage first
            loggedUser.setToken(resp.data.accessToken)
            loggedUser.setRefreshToken(resp.data.refreshToken)

            const userProfile = toUser(resp?.data)
            loggedUser.setUser(userProfile)

            // Update React state
            setUser(userProfile)
            setToken(resp.data.accessToken)
            setRefreshToken(resp.data.refreshToken)
            setShouldRedirectToHome(true)

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
            loginUser: login,
            refresh: handleRefreshToken,
            logoutUser: logout,
            isLoggedIn: isLoggedIn,
            shouldRedirectToHome: shouldRedirectToHome,
            clearRedirectFlag: () => setShouldRedirectToHome(false),
            loginError,
            clearLoginError: () => setLoginError(null)
        }}>
            {isReady ? children : null}
        </UserContext.Provider>
    )
}