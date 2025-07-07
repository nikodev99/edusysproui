import {ComponentType, ReactNode, useEffect} from "react";
import {useAuth} from "../hooks/useAuth.ts";
import {redirectTo} from "../context/RedirectContext.ts";

/**
 * Higher-Order Component for route protection
 * Uses this to wrap components that require authentication
 */
export const withAuthProtection = <P extends object>(
    WrappedComponent: ComponentType<P>
) => {
    return (props: P): ReactNode => {
        const { isLoggedIn } = useAuth();

        useEffect(() => {
            if (!isLoggedIn()) {
                redirectTo('/login');
            }
        }, [isLoggedIn]);

        if (!isLoggedIn()) {
            return <p>Utilisateur pas connecté...</p> // or a loading spinner
        }

        return <WrappedComponent {...props} />;
    };
}