import {FC, ReactNode, useCallback, useEffect} from "react";
import {useAuth} from "../hooks/useAuth.ts";
import LocalStorageManager from "../core/LocalStorageManager.ts";
import {useLocation} from "react-router-dom";
import {jwt} from "../core/utils/text_display.ts";
import {redirectTo} from "../context/RedirectContext.ts";
import {jwtTokenManager} from "../auth/jwt/JWTToken.tsx";
import {refreshToken} from "../auth/services/AuthService.ts.tsx";

const ACTIVITY_TIMEOUT = 30 * 60 * 1000
const ACTIVITY_CHECK_INTERNAL = 60 * 1000
const LAST_ACTIVITY_KEY = 'lastActivity'

const ACTIVITY_EVENTS = [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click',
]

interface AuthMiddlewareProps {
    children: ReactNode
}

export const AuthMiddleware: FC<AuthMiddlewareProps> = ({children}) => {
    const location = useLocation()
    const {logoutUser, isLoggedIn} = useAuth()

    const updateLastActivity = useCallback(() => {
        const currentTime = Date.now()
        LocalStorageManager.save(LAST_ACTIVITY_KEY, currentTime.toString())
    }, [])

    const checkInactivity = useCallback((): boolean => {
        const lastActivity = LocalStorageManager.get<string>(LAST_ACTIVITY_KEY)
        
        if (!lastActivity) {
            updateLastActivity()
            return false
        }
        
        const lastActivityTime = parseInt(lastActivity, 10)
        const timeSinceLastActivity = Date.now() - lastActivityTime
        
        return timeSinceLastActivity > ACTIVITY_TIMEOUT
    }, [updateLastActivity])

    const logoutAndRedirect = useCallback((...consoleMsg: unknown[]): false => {
        console.log(consoleMsg)
        logoutUser()
        redirectTo('/login')
        return false
    }, [logoutUser])

    const validateAndRefreshToken = useCallback(async (): Promise<boolean> => {
        if (!isLoggedIn() || location.pathname === '/login') {
            return true
        }

        try {
            const currentToken = LocalStorageManager.get<string>(jwt.tokenKey);
            if (!currentToken) {
                logoutAndRedirect("No token found, redirecting to login")
            }

            const isExpired = jwtTokenManager.isTokenExpired()
            if (isExpired) {
                console.log('Token expired, attempting refresh');
                const refreshSuccess = await refreshToken()

                if (refreshSuccess) {
                    console.log('Token refreshed successfully')
                    jwtTokenManager.refreshTokenCache()
                    return true
                }else {
                    logoutAndRedirect('Token refresh failed, logging out the user')
                }
            }

            const tokenValidation = await jwtTokenManager.verifyToken()

            if (!tokenValidation.isValid) {
                logoutAndRedirect("Token validation failed: ", tokenValidation.error)
            }

            return true

        }catch (error) {
            console.error('Error during token validation:', error);
            logoutUser();
            redirectTo('/login');
            return false;
        }
    }, [isLoggedIn, location.pathname, logoutAndRedirect, logoutUser])

    const performAuthCheck = useCallback(async () => {
        if (!isLoggedIn()) {
            return
        }

        if (checkInactivity()) {
            window.alert("User inactive for too long, logging out")
            logoutAndRedirect('User inactive for too long, logging out')
        }
        
        await validateAndRefreshToken()
    }, [checkInactivity, isLoggedIn, logoutAndRedirect, validateAndRefreshToken])
    
    const handleActivity = useCallback(() => {
        if (isLoggedIn()) {
            updateLastActivity()
        }
    }, [isLoggedIn, updateLastActivity])

    useEffect(() => {
        //Add activity event listeners
        ACTIVITY_EVENTS.forEach(event => {
            document.addEventListener(event, handleActivity, {passive: true})
        })
        
        if (isLoggedIn()) {
            updateLastActivity()
        }
        
        return () => {
            ACTIVITY_EVENTS.forEach(event => {
                document.removeEventListener(event, handleActivity)
            })
        }
    }, [handleActivity, isLoggedIn, updateLastActivity]);

    useEffect(() => {
        performAuthCheck().then()
        
        const authCheckInternal = setInterval(performAuthCheck, ACTIVITY_CHECK_INTERNAL)
        
        return () => {
            clearInterval(authCheckInternal)
        }
    }, [performAuthCheck]);

    useEffect(() => {
        performAuthCheck().then()
    }, [location.pathname, performAuthCheck]);

    useEffect(() => {
        const handleFocus = () => {
            if(isLoggedIn()) {
                performAuthCheck().then()
            }
        }
        
        window.addEventListener('focus', handleFocus)
        
        return () => {
            window.removeEventListener('focus', handleFocus)
        }
    }, [isLoggedIn, performAuthCheck]);

    return <>{children}</>
}