// Create NavigationHandler.tsx
import {ReactNode, useEffect, useState} from 'react';
import {useLocation, Navigate, useParams} from 'react-router-dom';
import {useAuth} from "../hooks/useAuth.ts";
import {toLower} from "../core/utils/utils.ts";
import {Flex, Spin} from "antd";

const NavigationHandler = ({ children, requireAuth = true }: { children: ReactNode, requireAuth?: boolean }) => {
    const { isLoggedIn, userSchools } = useAuth();
    const location = useLocation();
    const {schoolSlug} = useParams<{schoolSlug: string}>()
    const [isLoading, setIsLoading] = useState(true)

    console.log({userSchools, schoolSlug});

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000)

        return () => {
            clearTimeout(timer)
        }
    }, []);

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

    // For public routes like the login page (requireAuth = false)
    if (!isLoading && !requireAuth && isLoggedIn()) {
        // User is already authenticated, redirect to dashboard
        if (userSchools && Object.keys(userSchools).length !== 0) {
            const userSchool = toLower(userSchools?.abbr);
            return <Navigate to={`/${userSchool}`} replace />;
        }else {
            return <Navigate to="/active_school" replace />;
        }
    }

    return <>{children}</>;
};

export default NavigationHandler;