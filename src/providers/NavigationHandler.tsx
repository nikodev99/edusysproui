// Create NavigationHandler.tsx
import {ReactNode} from 'react';
import {useLocation, Navigate} from 'react-router-dom';
import {useAuth} from "../hooks/useAuth.ts";

const NavigationHandler = ({ children, requireAuth = true }: { children: ReactNode, requireAuth?: boolean }) => {
    const { isLoggedIn } = useAuth();
    const location = useLocation();

    if (requireAuth && !isLoggedIn()) {
        // User is not authenticated, redirect to log in
        // Save the attempted location, so we can redirect back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // For public routes like the login page (requireAuth = false)
    if (!requireAuth && isLoggedIn()) {
        // User is already authenticated, redirect to dashboard
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default NavigationHandler;