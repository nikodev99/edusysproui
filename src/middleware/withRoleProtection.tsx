import {ComponentType, FC} from "react";
import {RoleBasedRouteGuard} from "./RoleBasedRouteGuard.tsx";

/**
 * Higher-order component that wraps a provided component with role-based route protection.
 * Ensures that the wrapped component is only accessible to users with the appropriate roles.
 *
 * @template P - The prop type of the wrapped component.
 * @param {ComponentType} Component - The component to be wrapped with role protection.
 * @returns {FC<P>} A functional component with role-based access control applied.
 */
export const withRoleProtection = <P extends object>(Component: ComponentType): FC<P> => {
    return (props: P) => (
        <RoleBasedRouteGuard>
            <Component {...props} />
        </RoleBasedRouteGuard>
    )
}