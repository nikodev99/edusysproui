import {ReactNode, useEffect, useState} from 'react';
import {useLocation, Navigate} from 'react-router-dom';
import {useAuth} from "../hooks/useAuth.ts";
import {Flex, Spin} from "antd";
import {toLower} from "../core/utils/utils.ts";
import {useGlobalStore} from "../core/global/store.ts";

const NavigationHandler = ({ children, requireAuth = true }: { children: ReactNode, requireAuth?: boolean }) => {
    const { isLoggedIn, userSchool, shouldPickSchool, user } = useAuth();
    const setSchool = useGlobalStore(state => state.setSchool);

    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setSchool()
        
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000)

        return () => {
            clearTimeout(timer)
        }
    }, [setSchool]);

    if (isLoading) {
        return(
            <Flex align='center' justify='center' style={{height: '100vh', margin: '0 auto'}}>
                <Spin
                    size="large"
                    style={{color: '#000C40', fontSize: 48}}
                />
            </Flex>
        )
    }

    if (!isLoading && requireAuth && !isLoggedIn()) {
        // User is not authenticated, redirect to log in
        // Save the attempted location, so we can redirect back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Handle already authenticated users trying to access public routes (like login page)
    if (!isLoading && !requireAuth && isLoggedIn()) {
        // User is already authenticated, determine where to redirect them
        // ENHANCED LOGIC: Better school selection and redirection handling
        if (userSchool && Object.keys(userSchool).length !== 0 && !shouldPickSchool()) {
            // User has a selected school - redirect to their dashboard
            const school = toLower(userSchool?.abbr);
            return <Navigate to={`/${school}`} replace />;
        } else if (user && user.schools) {
            // User doesn't have a selected school but has schools available
            if (Array.isArray(user.schools)) {
                if (user.schools.length === 1 && !shouldPickSchool()) {
                    // Single school case - this shouldn't happen if UserProvider logic works correctly,
                    // But we add it as a safety net
                    const school = toLower(user.schools[0]?.abbr);
                    return <Navigate to={`/${school}`} replace />;
                } else if (user.schools.length > 1) {
                    // Multiple schools - redirect to school selection page
                    return <Navigate to="/active_school" replace />;
                } else {
                    // No schools available - this might be an error case
                    return <Navigate to="/active_school" replace />;
                }
            } else {
                // Schools is not an array - redirect to school selection as fallback
                return <Navigate to="/login" replace />;
            }
        } else {
            // No user or school data available - redirect to school selection
            return <Navigate to="/login" replace />;
        }
    }

    return <>{children}</>;
};

export default NavigationHandler;