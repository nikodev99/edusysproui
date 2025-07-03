import React from "react";
import {useAuth} from "../hooks/useAuth.ts";
import {redirectTo} from "../context/RedirectContext.ts";

/**
 * Higher-Order Component for route protection
 * Use this to wrap components that require authentication
 */
export const withAuthProtection = <P extends object>(
    WrappedComponent: React.ComponentType<P>
) => {
    return (props: P) => {
        const { isLoggedIn } = useAuth();

        React.useEffect(() => {
            if (!isLoggedIn()) {
                redirectTo('/login');
            }
        }, [isLoggedIn]);

        if (!isLoggedIn()) {
            return null; // or a loading spinner
        }

        return <WrappedComponent {...props} />;
    };
};