import {ReactNode, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {loggedUser} from "../auth/jwt/LoggedUser.ts";
import {routeAccess} from "./routeAccess.ts";
import {message} from "antd";
import {redirectTo} from "../context/RedirectContext.ts";

interface RoleBasedRouteGuardProps {
    children: ReactNode;
    routePath?: string;
    redirectTo?: string;
}

/**
 * RoleBasedRouteGuard Component
 *
 * This middleware component checks if the current user has the appropriate
 * roles to access the current route. If not, it redirects them to the home page.
 *
 * Key Features:
 * - Works with your existing /:schoolSlug routing structure
 * - Automatically extracts and checks routes without school prefix
 * - Top admins always have full access
 * - Logs access denial attempts for debugging
 * - Can be combined with your existing withAuthProtection HOC
 *
 * Usage in your Route.tsx:
 *
 * Instead of:
 * { path: 'students', children: [
 *   { path: text.path.page, element: <ListStudentPage />},
 * ]}
 *
 * Use:
 * { path: 'students', element: <RoleBasedRouteGuard> <Outlet /></RoleBasedRouteGuard>, children: [
 *   { path: text.path.page, element: <ListStudentPage />},
 * ]}
 *
 * Or wrap individual route elements:
 * { path: text.path.page, element: <RoleBasedRouteGuard> <ListStudentPage /></RoleBasedRouteGuard>}
 */
export const RoleBasedRouteGuard = ({children, routePath, redirectTo: customRedirect}: RoleBasedRouteGuardProps) => {
    const location = useLocation()
    const pathname = routePath || location.pathname
    const [hasCheckedAccess, setHasCheckedAccess] = useState<boolean>(false)

    useEffect(() => {
        const userRoles = loggedUser.getRole() || []
        const hasAccess = routeAccess.checkRouteAccess(pathname, userRoles)

        if (!hasAccess) {
            const {fullRoute, module: moduleName, action} = routeAccess.extractRouteWithoutSchoolSlug(pathname)
            message.warning(
                `You don't have permission to access this page. ` +
                `Required permissions for: "${moduleName}"` +
                (action ? ` → "${action}"` : '')
            ).then()

            console.warn(
                `[Access Denied] User with roles [${userRoles.join(', ')}] ` +
                `attempted to access module: "${moduleName}"` +
                (action ? `, action: "${action}"` : '') +
                ` (full path: ${fullRoute})`
            )

            const pathParts = pathname.split('/').filter(Boolean)
            const schoolSlug = pathParts[0]
            const redirectPath = customRedirect || `/${schoolSlug}`

            redirectTo(redirectPath)
        }
        setHasCheckedAccess(true)
    }, [customRedirect, pathname]);

    if (!hasCheckedAccess) {
        return null
    }

    const userRoles = loggedUser.getRole() || []
    const hasAccess = routeAccess.checkRouteAccess(pathname, userRoles)

    return hasAccess ? <>{children}</> : null
}