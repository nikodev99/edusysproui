import {useEffect, useState} from "react";
import {LoginRequest, SignupRequest, UserProfile} from "../auth/dto/user.ts";
import LocalStorageManager from "../core/LocalStorageManager.ts";
import {jwt} from "../core/utils/text_display.ts";
import {loginApi, logoutApi, signupApi} from "../auth/services/AuthService.ts.tsx";
import {message} from "antd";
import {UserContext, UserContextProps} from "../context/UserContext.ts";
import {jwtTokenManager} from "../auth/jwt/JWTToken.tsx";

export const UserProvider = ({children}: UserContextProps) => {
    const [token, setToken] = useState<string | null>(null)
    const [refreshToken, setRefreshToken] = useState<string | null>(null)
    const [user, setUser] = useState<UserProfile | null>(null)
    const [isReady, setIsReady] = useState(false)
    const [shouldRedirectToHome, setShouldRedirectToHome] = useState(false)
    const [loginError, setLoginError] = useState<string | null>(null)

    useEffect(() => {
        const initAuth = async () => {
            const userId = LocalStorageManager.get(jwt.user)
            const token = LocalStorageManager.get(jwt.tokenKey)

            if (userId && token) {
                const isValidToken = await jwtTokenManager.isValidToken()

                if(isValidToken) {
                    //TODO retrieve an Employee, Teacher or Guardian
                    setUser(userId as UserProfile)
                    setToken(token as string)
                    setRefreshToken(LocalStorageManager.get(jwt.refreshTokenKey))
                }else {
                    performLogout(false)
                }
            }
            setIsReady(true)
        }

        initAuth().then()
    }, [])

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
                LocalStorageManager.update(jwt.tokenKey, () => resp.data.accessToken)
                LocalStorageManager.update(jwt.refreshTokenKey, () => resp.data.refreshToken)

                //TODO retrieve an Employee, Teacher or Guardian

                const useProfile = {user: {id: resp.data.id}} as UserProfile
                LocalStorageManager.update(jwt.user, () => useProfile)

                setUser(useProfile)
                setToken(resp.data.accessToken)
                setRefreshToken(resp.data.refreshToken)
                setShouldRedirectToHome(true)

                jwtTokenManager.refreshTokenCache()

                return true
            }else {
                setLoginError("Username ou mot de passe invalide(s) !")
                return false
            }
        }catch(error) {
            message.error("An error occurred while logging in, please try again...", 5)
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
            LocalStorageManager.remove(jwt.tokenKey)
            LocalStorageManager.remove(jwt.refreshTokenKey)
            LocalStorageManager.remove(jwt.user)
            LocalStorageManager.remove('lastActivity')

            jwtTokenManager.clearCache()

            setUser(null)
            setToken(null)
            setRefreshToken(null)
            setShouldRedirectToHome(false)
            setLoginError(null)
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
            registerUser: register,
            loginUser: login,
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