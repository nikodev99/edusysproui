import {useLocation} from "react-router-dom";
import {loggedUser} from "../auth/jwt/LoggedUser.ts";
import {routeAccess} from "../middleware/routeAccess.ts";

export const useRouteAccess = (route?: string): boolean => {
    const location = useLocation()

    const checkPath = route
        ? location.pathname.split('/').slice(0, 2).join('/') + '/' + route
        : location.pathname

    const user = loggedUser.getUser()
    const userRoles = user?.roles ?? []

    return routeAccess.checkRouteAccess(checkPath, userRoles)
}