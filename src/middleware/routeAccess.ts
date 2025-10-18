import {
    isAdmin,
    isEnroll,
    isFinance,
    isGuardian,
    isHR,
    isSecretary,
    isTeacher,
    isTopAdmin,
    Role
} from "../auth/dto/role.ts";
import {message} from "antd";
import {text} from "../core/utils/text_display.ts";
import {ItemType} from "antd/es/menu/interface";

interface RouteAccessMap {
    module?: ((roles: Role[]) => boolean)[]
    actions?: {
        [actionPath: string]: ((roles: Role[]) => boolean)[]
    }
}

interface MenuPermission {
    canView: (roles: Role[]) => boolean
}

class RouteAccess {

    private routeAccessMap: Record<string, RouteAccessMap> = {
        '/': {
            module: []
        },

        'home': {
            module: []
        },

        /**
         * Represents an array of access control functions for the 'students' feature.
         * Each function in the array determines if a user has the necessary role
         * or permission to access or perform actions related to students.
         *
         * The functions within the array evaluate whether the user meets any of
         * the following conditions:
         * - The user is a top-level administrator (as determined by `isTopAdmin`).
         * - The user has enrollment permissions (as determined by `isEnroll`).
         * - The user has teacher privileges (as determined by `isTeacher`).
         *
         * @type {Array<Function>}
         */
        'students': {
            module: [
                (roles) => isTopAdmin(roles) || isEnroll(roles) || isTeacher(roles)
            ],
            actions: {
                'new': [
                    (roles) => isTopAdmin(roles) || isEnroll(roles)
                ]
            }
        },

        /**
         * Defines a permission system for `guardians` using an array of role-checking functions.
         * Each function determines access based on the roles provided.
         *
         * @param {Array<string>} roles - The list of roles assigned to a user.
         * @returns {boolean} - Returns true if the user meets any of the defined role conditions.
         *
         * Role conditions:
         * 1. The user is a top administrator (`isTopAdmin`).
         * 2. The user has a finance-related role (`isFinance`).
         * 3. The user holds a teacher role (`isTeacher`).
         * 4. The user is a guardian (`isGuardian`).
         *
         * The function grants access to anyone satisfying at least one of these conditions.
         */
        'guardians': {
            module: [
                (roles) => isTopAdmin(roles) || isFinance(roles) || isTeacher(roles) || isGuardian(roles)
            ]
        },

        /**
         * An array containing functions that determine whether a user has access to the 'teachers' role.
         * Each function evaluates the user's roles and checks specific conditions.
         *
         * The conditions checked are:
         * - If the user has the 'top admin' role.
         * - If the user has the 'finance' role.
         * - If the user has the 'teacher' role.
         * - If the user has the 'HR' role.
         *
         * These checks are done using helper functions such as `isTopAdmin`, `isFinance`, `isTeacher`, and `isHR`.
         */
        'teachers': {
            module: [
                (roles) => isTopAdmin(roles) || isFinance(roles) || isHR(roles)
            ],
            actions: {
                'new': [
                    (roles) => isTopAdmin(roles) || isHR(roles)
                ]
            }
        },

        /**
         * Defines a permission rule for 'classes-and-subjects'. This rule determines
         * access rights based on the provided roles of a user.
         *
         * The rule grants access if the user satisfies any of the following conditions:
         * 1. The user has a top admin role.
         * 2. The user has an admin role.
         * 3. The user has a secretary role.
         *
         * @param {Array<Function>} rolesFunctions - An array of functions that checks the roles of the user.
         * @returns {boolean} The access decision (true if access is granted, false otherwise).
         */
        'classes-and-subjects': {
            module: [
                (roles) => isTopAdmin(roles) || isAdmin(roles) || isSecretary(roles)
            ]
        },

        /**
         * Checks user roles to determine access permissions for "examinations".
         *
         * The "examinations" array contains a function that evaluates if a user
         * belongs to specific roles such as a top-level admin or a teacher, granting
         * them access.
         *
         * @param {Array} roles - The list of roles assigned to a user.
         * @returns {boolean} Returns true if the user is a top-level admin or a teacher,
         * otherwise false.
         */
        'examinations': {
            module: [
                (roles) => isTopAdmin(roles) || isTeacher(roles)
            ],
            actions: {
                'new': [
                    (roles) => isTeacher(roles)
                ]
            }
        },

        /**
         * An array of functions used to evaluate user permissions for the "attendances" feature.
         * Each function in the array takes user roles as input and returns a boolean value.
         *
         * The current function checks if a user is either a top-level administrator
         * or a secretary based on their roles.
         *
         * @type {Array<Function>}
         * @param {Array<string>} roles - The roles assigned to the user.
         * @returns {boolean} - Indicates whether the user has permission based on their role(s).
         */
        'attendances': {
            module: [
                (roles) => isTopAdmin(roles) || isSecretary(roles)
            ]
        },

        /**
         * Represents a set of access rules for the 'library' section. Each function in the array
         * evaluates a condition based on the user's roles to determine access.
         *
         * @property {Array<Function>} library - Array of functions that check user access for the 'library' section.
         * Each function takes roles as input, evaluates the roles using specific conditions,
         * and returns a boolean indicating if access is granted.
         */
        'library': {
            module: [
                (roles) => isTopAdmin(roles) || isSecretary(roles)
            ]
        },

        /**
         * Determines access permissions for the "fee-and-finance" feature.
         * This is represented as an array of functions that evaluate user roles.
         *
         * @type {Array<Function>}
         * Each function receives a `roles` parameter and performs a boolean check
         * to determine if the user has the necessary permissions for the feature.
         *
         * @param {Array} roles - A collection of user roles.
         * @returns {boolean} - Returns true if the user has one of the required roles, such as top admin or finance, otherwise false.
         */
        'fee-and-finance': {
            module: [
                (roles) => isTopAdmin(roles) || isFinance(roles)
            ]
        },

        'chat': {
            module: []
        },

        /**
         * An object property used for staff management, containing a list of functions
         * to evaluate permissions for specific roles.
         *
         * This array contains a function that checks if the given roles
         * belong to either a "Top Admin" or an "HR" (Human Resources) role.
         *
         * @param {string[]} roles - An array of roles to be evaluated for permissions.
         * @returns {boolean} Returns true if the roles include "Top Admin" or "HR", otherwise false.
         */
        'staff-management': {
            module: [
                (roles) => isTopAdmin(roles) || isHR(roles)
            ]
        },

        /**
         * Determines the access permissions for the "organization" resource based on user roles.
         *
         * Each function in the array evaluates whether the user is granted permission to access
         * the "organization" resource. The provided functions check specific role conditions.
         *
         * Logic:
         * - It checks whether the user possesses the "Admin" or "Top Admin" roles by invoking
         *   the `isAdmin` or `isTopAdmin` functions respectively.
         *
         * @param {Array<Function>} roles An array of functions evaluating user role permissions.
         * @returns {boolean} Returns true if the user has "Admin" or "Top Admin" privileges, otherwise false.
         */
        'organization': {
            module: [
                (roles) => isAdmin(roles) || isTopAdmin(roles)
            ]
        },

        'organization/school': {
            module: [
                (roles) => isAdmin(roles) || isTopAdmin(roles)
            ]
        },
        'organization/academic_year': {
            module: [
                (roles) => isAdmin(roles) || isTopAdmin(roles)
            ]
        },
        'organization/grades': {
            module: [
                (roles) => isAdmin(roles) || isTopAdmin(roles)
            ]
        },
        'organization/departments': {
            module: [
                (roles) => isAdmin(roles) || isTopAdmin(roles)
            ]
        },
        'organization/users': {
            module: [
                (roles) => isAdmin(roles) || isTopAdmin(roles)
            ],
            actions: {
                'new': [
                    (roles) => isAdmin(roles) || isTopAdmin(roles)
                ],
                ':id/:slug/change-password': [],
                ':slug/activity': [],
                ':slug': []
            }
        },

        'settings': {
            module: [
                (roles) => isAdmin(roles) || isTopAdmin(roles)
            ]
        },
        'settings/customize': {
            module: [
                (roles) => isAdmin(roles) || isTopAdmin(roles)
            ]
        },
        'settings/legal_certificate': {
            module: []
        },
        'settings/general_term': {
            module: []
        },
        'settings/special_document': {
            module: [
                (roles) => isAdmin(roles) || isTopAdmin(roles)
            ]
        },
    }

    private menuPermissions: Record<string, MenuPermission> = {
        [text.student.href]: {
            canView: (roles) => isTopAdmin(roles) || isEnroll(roles) || isTeacher(roles)
        },

        [text.guardian.href]: {
            canView: (roles) => isTopAdmin(roles) || isFinance(roles) || isTeacher(roles) || isGuardian(roles)
        },

        [text.teacher.href]: {
            canView: (roles) => isTopAdmin(roles) || isFinance(roles) || isHR(roles)
        },

        [text.cc.href]: {
            canView: (roles) => isTopAdmin(roles) || isAdmin(roles) || isSecretary(roles)
        },

        [text.exam.href]: {
            canView: (roles) => isTopAdmin(roles) || isTeacher(roles)
        },

        [text.att.href]: {
            canView: (roles) => isTopAdmin(roles) || isSecretary(roles)
        },

        [text.finance.href]: {
            canView: (roles) => isTopAdmin(roles) || isFinance(roles)
        },

        '/report-and-analytics': {
            canView: (roles) => isTeacher(roles) || isAdmin(roles) || isEnroll(roles)
        },

        [text.employee.href]: {
            canView: (roles) => isTopAdmin(roles) || isHR(roles)
        },

        [text.org.href]: {
            canView: (roles) => isAdmin(roles) || isTopAdmin(roles)
        },

        [text.settings.href]: {
            canView: (roles) => isAdmin(roles) || isTopAdmin(roles)
        }
    }

    public extractRouteWithoutSchoolSlug (pathname: string): { fullRoute: string; module: string; action: string } {
        const parts = pathname.split('/').filter(Boolean);

        // Remove school slug (first part)
        if (parts.length > 1) {
            const routeParts = parts.slice(1);
            const fullRoute = routeParts.join('/');
            const modulePath = routeParts[0];
            const action = routeParts.slice(1).join('/');

            return { fullRoute, module: modulePath, action };
        }

        return { fullRoute: '', module: '', action: '' };
    }

    public checkRouteAccess (pathname: string, roles: Role[]): boolean {
        if (!roles || roles.length === 0) {
            message.warning("User has no roles assigned, denying access").then()
            return false
        }

        const {fullRoute, module: moduleName, action} = this.extractRouteWithoutSchoolSlug(pathname)

        const moduleConfig = this.routeAccessMap[moduleName] || this.routeAccessMap[fullRoute]

        if (!moduleConfig) {
            for (const [routePattern, config] of Object.entries(this.routeAccessMap)) {
                if (fullRoute.startsWith(routePattern)) {
                    return this.checkModuleAndAction(config, action, roles)
                }
            }

            return true
        }

        return this.checkModuleAndAction(moduleConfig, action, roles)
    }

    private checkModuleAndAction (config: RouteAccessMap, action: string, roles: Role[]): boolean {
        if (config.module && config.module.length > 0) {
            const hasModuleAccess = config.module.some(checker => checker(roles))
            if (!hasModuleAccess) {
                return false
            }
        }

        if (action && config.actions) {
            if (config.actions[action]) {
                const actionCheckers = config.actions[action]

                if (actionCheckers.length === 0)
                    return true

                return actionCheckers.some(checker => checker(roles))
            }
        }

        for (const [actionPattern, checkers] of Object.entries(config.actions || {})) {
            if (actionPattern.startsWith(':') || action.match(new RegExp(action))) {
                if (checkers.length === 0)
                    return true

                return checkers.some(checker => checker(roles))
            }
        }

        return true
    }

    private canViewMenuItem (menuKey: string, roles: Role[]): boolean {
        if (isTopAdmin(roles)) {
            return true
        }

        const permission = this.menuPermissions[menuKey]

        if (!permission) {
            return true
        }

        return permission.canView(roles)
    }

    public filterMenuItems (items: ItemType[], roles: Role[]): ItemType[] {
        return items.map(item => {
            if (!item || typeof item !== "object" || !('in' in item)) {
                return item
            }

            const itemCopy = {...item}

            // If this item has children (it's a submenu), filter the children recursively
            if ('children' in itemCopy && Array.isArray(itemCopy.children)) {
                const filteredChildren = this.filterMenuItems(itemCopy.children, roles)

                // If all children were filtered out, we should hide the parent to
                // An empty submenu is confusing and looks broken to users
                if (filteredChildren.length === 0)
                    return null

                itemCopy.children = filteredChildren
            }

            const itemKey = String(itemCopy.key)
            if (!this.canViewMenuItem(itemKey, roles)) {
                return null
            }

            return itemCopy
        })
            .filter(Boolean)
    }
}

export const routeAccess = new RouteAccess()