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
    module?: (() => boolean)[]
    actions?: {
        [actionPath: string]: (() => boolean)[]
    }
}

interface MenuPermission {
    canView: () => boolean
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
                () => isTopAdmin() || isEnroll() || isTeacher()
            ],
            actions: {
                'new': [
                    () => isTopAdmin() || isEnroll()
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
                () => isTopAdmin() || isFinance() || isTeacher() || isGuardian()
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
                () => isTopAdmin() || isFinance() || isHR()
            ],
            actions: {
                'new': [
                    () => isTopAdmin() || isHR()
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
                () => isTopAdmin() || isAdmin() || isSecretary()
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
                () => isTopAdmin() || isTeacher()
            ],
            actions: {
                'new': [
                    () => isTeacher()
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
                () => isTopAdmin() || isSecretary()
            ]
        },

        /**
         * Represents a set of access rules for the 'library' section. Each function in the array
         * evaluates a condition based on the user's to determine access.
         *
         * @property {Array<Function>} library - Array of functions that check user access for the 'library' section.
         * Each function takes roles as input, evaluates the roles using specific conditions,
         * and returns a boolean indicating if access is granted.
         */
        'library': {
            module: [
                () => isTopAdmin() || isSecretary()
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
                () => isTopAdmin() || isFinance()
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
                () => isTopAdmin() || isHR()
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
                () => isAdmin() || isTopAdmin()
            ]
        },

        'organization/school': {
            module: [
                () => isAdmin() || isTopAdmin()
            ]
        },
        'organization/academic_year': {
            module: [
                () => isAdmin() || isTopAdmin()
            ]
        },
        'organization/grades': {
            module: [
                () => isAdmin() || isTopAdmin()
            ]
        },
        'organization/departments': {
            module: [
                () => isAdmin() || isTopAdmin()
            ]
        },
        'organization/users': {
            module: [
                () => isAdmin() || isTopAdmin()
            ],
            actions: {
                'new': [
                    () => isAdmin() || isTopAdmin()
                ],
                ':id/:slug/change-password': [],
                ':slug/activity': [],
                ':slug': []
            }
        },

        'settings': {
            module: [
                () => isAdmin() || isTopAdmin()
            ]
        },
        'settings/customize': {
            module: [
                () => isAdmin() || isTopAdmin()
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
                () => isAdmin() || isTopAdmin()
            ]
        },
    }

    private menuPermissions: Record<string, MenuPermission> = {
        [text.student.href]: {
            canView: () => isTopAdmin() || isEnroll() || isTeacher()
        },

        [text.guardian.href]: {
            canView: () => isTopAdmin() || isFinance() || isTeacher() || isGuardian()
        },

        [text.teacher.href]: {
            canView: () => isTopAdmin() || isFinance() || isHR()
        },

        [text.cc.href]: {
            canView: () => isTopAdmin() || isAdmin() || isSecretary()
        },

        [text.exam.href]: {
            canView: () => isTopAdmin() || isTeacher()
        },

        [text.att.href]: {
            canView: () => isTopAdmin() || isSecretary()
        },

        [text.finance.href]: {
            canView: () => isTopAdmin() || isFinance()
        },

        '/report-and-analytics': {
            canView: () => isTeacher() || isAdmin() || isEnroll()
        },

        [text.employee.href]: {
            canView: () => isTopAdmin() || isHR()
        },

        [text.org.href]: {
            canView: () => isAdmin() || isTopAdmin()
        },

        [text.settings.href]: {
            canView: () => isAdmin() || isTopAdmin()
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
                    return this.checkModuleAndAction(config, action)
                }
            }

            return true
        }

        return this.checkModuleAndAction(moduleConfig, action)
    }

    private checkModuleAndAction (config: RouteAccessMap, action: string): boolean {
        if (config.module && config.module.length > 0) {
            const hasModuleAccess = config.module.some(checker => checker())
            if (!hasModuleAccess) {
                return false
            }
        }

        if (action && config.actions) {
            if (config.actions[action]) {
                const actionCheckers = config.actions[action]

                if (actionCheckers.length === 0)
                    return true

                return actionCheckers.some(checker => checker())
            }
        }

        for (const [actionPattern, checkers] of Object.entries(config.actions || {})) {
            if (actionPattern.startsWith(':') || action.match(new RegExp(action))) {
                if (checkers.length === 0)
                    return true

                return checkers.some(checker => checker())
            }
        }

        return true
    }

    private canViewMenuItem (menuKey: string): boolean {
        if (isTopAdmin()) {
            return true
        }

        const permission = this.menuPermissions[menuKey]

        if (!permission) {
            return true
        }

        return permission.canView()
    }

    public filterMenuItems (items: ItemType[]): ItemType[] {
        return items.map(item => {
            if (!item || typeof item !== "object" || !('in' in item)) {
                return item
            }

            const itemCopy = {...item}

            // If this item has children (it's a submenu), filter the children recursively
            if ('children' in itemCopy && Array.isArray(itemCopy.children)) {
                const filteredChildren = this.filterMenuItems(itemCopy.children)

                // If all children were filtered out, we should hide the parent to
                // An empty submenu is confusing and looks broken to users
                if (filteredChildren.length === 0)
                    return null

                itemCopy.children = filteredChildren
            }

            const itemKey = String(itemCopy.key)
            if (!this.canViewMenuItem(itemKey)) {
                return null
            }

            return itemCopy
        })
            .filter(Boolean)
    }
}

export const routeAccess = new RouteAccess()