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
import {text} from "../core/utils/text_display.ts";
import {ItemType} from "antd/es/menu/interface";

/**
 * Permission Levels
 *
 * These define what a user can do within a module or on a specific resource.
 * Think of them as layers of access, where each level builds on the previous:
 *
 * - NONE: Cannot access at all (used as a default/explicit denial)
 * - VIEW: Can see the data but cannot make any changes
 * - CREATE: Can create new records (implies VIEW)
 * - EDIT: Can modify existing records (implies VIEW)
 * - DELETE: Can remove records (implies VIEW)
 * - FULL: Can do everything including special admin actions (implies all above)
 */
export enum PermissionLevel {
    NONE = 'NONE',
    CREATE = 'CREATE',
    EDIT = 'EDIT',
    DELETE = 'DELETE',
    FULL = 'FULL'
}

interface ModulePermissions {
    create: (() => boolean)[]
    edit: (() => boolean)[]
    delete: (() => boolean)[]
    special?: {
        [actionName: string]: (() => boolean)[]
    }
}

interface RouteAccessMap {
    module?: (() => boolean)[]
    actions?: {
        [actionPath: string]: (() => boolean)[]
    },
    permissions?: ModulePermissions
}

interface MenuPermission {
    canView: () => boolean
}

class RouteAccess {

    private routeAccessMap: Record<string, RouteAccessMap> = {
        '': {
            module: [],
            permissions: {
                create: [],
                edit: [],
                delete: []
            }
        },

        'dashboard': {
            module: [],
            permissions: {
                create: [],
                edit: [],
                delete: []
            }
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
                () => isTopAdmin() || isEnroll() || isTeacher() || isSecretary()
            ],
            actions: {
                'new': [
                    () => isTopAdmin() || isEnroll()
                ],
                ':id': [
                    () => isTopAdmin() || isTeacher() || isSecretary() || isGuardian()
                ],
                ':id/discipline': [
                    () => isTopAdmin() || isTeacher()
                ]
            },
            permissions: {
                create: [
                    () => isTopAdmin() || isEnroll()
                ],
                edit: [
                    () => isTopAdmin() || isEnroll()
                ],
                delete: [
                    () => isTopAdmin()
                ],
                special: {
                    'export': [
                        () => isTopAdmin() || isEnroll() || isTeacher()
                    ],
                    'reprimand': [
                        () => isTopAdmin() || isTeacher()
                    ],
                    'showClassmates': [
                        () => isTopAdmin() || isTeacher() || isEnroll()
                    ],
                    'teacherData': [
                        () => isTeacher()
                    ],
                }
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
         *
         * The function grants access to anyone satisfying at least one of these conditions.
         */
        'guardians': {
            module: [
                () => isTopAdmin() || isFinance() || isTeacher() || isEnroll()
            ],
            actions: {
                'new': [
                    () => isTopAdmin() || isEnroll()
                ],
                ':id': [
                    () => isTopAdmin() || isFinance() || isTeacher() || isEnroll() || isGuardian()
                ]
            },
            permissions: {
                create: [
                    () => isTopAdmin() || isEnroll()
                ],
                edit: [
                    () => isTopAdmin() || isEnroll()
                ],
                delete: [
                    () => isTopAdmin()
                ],
                special: {
                    // Finance can view payment information
                    'viewPayments': [
                        () => isTopAdmin() || isFinance() || isGuardian()
                    ],
                    // Guardians can update their own contact preferences
                    'updateContactPreferences': [
                        () => isGuardian()
                    ]
                }
            }
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
                ],
                ':id': [
                    () => isTopAdmin() || isHR() || isTeacher()
                ]
            },
            permissions: {
                create: [
                    () => isTopAdmin() || isHR()
                ],
                edit: [
                    () => isTopAdmin() || isHR()
                ],
                delete: [
                    () => isTopAdmin()
                ],
                special: {
                    // Finance can view salary information
                    'viewSalary': [
                        () => isTopAdmin() || isFinance()
                    ],
                    // HR can manage employment contracts
                    'manageContracts': [
                        () => isTopAdmin() || isHR()
                    ]
                }
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
                () => isTopAdmin() || isAdmin() || isSecretary() || isTeacher()
            ],
            permissions: {
                create: [
                    () => isTopAdmin() || isAdmin() || isSecretary()
                ],
                edit: [
                    () => isTopAdmin() || isAdmin() || isSecretary()
                ],
                delete: [
                    () => isTopAdmin() || isAdmin()
                ],
                special: {
                    // Teachers can assign homework even if they can't create classes
                    'assignHomework': [
                        () => isTopAdmin() || isTeacher()
                    ],
                    // Only admins can modify the class schedule
                    'modifySchedule': [
                        () => isTopAdmin() || isAdmin() || isSecretary()
                    ]
                }
            }
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
                    () => isTopAdmin() || isTeacher()
                ]
            },
            permissions: {
                create: [
                    () => isTopAdmin() || isTeacher()
                ],
                edit: [
                    () => isTopAdmin() || isTeacher()
                ],
                delete: [
                    () => isTopAdmin() || isTeacher()
                ],
                special: {
                    // Only admins can publish final results school-wide
                    'publishResults': [
                        () => isTopAdmin() || isTeacher()
                    ]
                }
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
            ],
            permissions: {
                create: [
                    () => isTopAdmin() || isSecretary() || isTeacher()
                ],
                edit: [
                    () => isTopAdmin() || isSecretary()
                ],
                delete: [
                    () => isTopAdmin()
                ],
                special: {
                    // Teachers can mark attendance for their classes
                    'markAttendance': [
                        () => isTopAdmin() || isTeacher() || isSecretary()
                    ],
                    // Only a secretary can correct historical records
                    'correctRecords': [
                        () => isTopAdmin() || isSecretary()
                    ]
                }
            }
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
            ],
            permissions: {
                create: [
                    () => isTopAdmin() || isSecretary()
                ],
                edit: [
                    () => isTopAdmin() || isSecretary()
                ],
                delete: [
                    () => isTopAdmin()
                ],
                special: {
                    'issueBooks': [
                        () => isTopAdmin() || isSecretary()
                    ],
                    'returnBooks': [
                        () => isTopAdmin() || isSecretary()
                    ]
                }
            }
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
            ],
            permissions: {
                create: [
                    () => isTopAdmin() || isFinance()
                ],
                edit: [
                    () => isTopAdmin() || isFinance()
                ],
                delete: [
                    () => isTopAdmin()
                ],
                special: {
                    'recordPayment': [
                        () => isTopAdmin() || isFinance()
                    ],
                    'generateInvoice': [
                        () => isTopAdmin() || isFinance()
                    ],
                    'viewReports': [
                        () => isTopAdmin() || isFinance()
                    ],
                    // Only top admin can approve refunds (financial control)
                    'approveRefund': [
                        () => isTopAdmin()
                    ]
                }
            }
        },

        'chat': {
            module: [],
            permissions: {
                create: [],
                edit: [],
                delete: []
            }
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
            ],
            permissions: {
                create: [
                    () => isTopAdmin() || isHR()
                ],
                edit: [
                    () => isTopAdmin() || isHR()
                ],
                delete: [
                    () => isTopAdmin()
                ],
                special: {
                    'manageLeave': [
                        () => isTopAdmin() || isHR()
                    ],
                    'viewPayroll': [
                        () => isTopAdmin() || isFinance()
                    ]
                }
            }
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
            ],
            permissions: {
                create: [
                    () => isAdmin() || isTopAdmin()
                ],
                edit: [
                    () => isAdmin() || isTopAdmin()
                ],
                delete: [
                    () => isTopAdmin()
                ]
            }
        },

        'organization/school': {
            module: [
                () => isAdmin() || isTopAdmin()
            ],
            permissions: {
                create: [
                    () => isAdmin() || isTopAdmin()
                ],
                edit: [
                    () => isAdmin() || isTopAdmin()
                ],
                delete: [
                    () => isTopAdmin()
                ]
            }
        },
        'organization/academic_year': {
            module: [
                () => isAdmin() || isTopAdmin()
            ],
            permissions: {
                create: [
                    () => isAdmin() || isTopAdmin()
                ],
                edit: [
                    () => isAdmin() || isTopAdmin()
                ],
                delete: [
                    () => isTopAdmin()
                ]
            }
        },
        'organization/grades': {
            module: [
                () => isAdmin() || isTopAdmin()
            ],
            permissions: {
                create: [
                    () => isAdmin() || isTopAdmin()
                ],
                edit: [
                    () => isAdmin() || isTopAdmin()
                ],
                delete: [
                    () => isTopAdmin()
                ]
            }
        },
        'organization/departments': {
            module: [
                () => isAdmin() || isTopAdmin()
            ],
            permissions: {
                create: [
                    () => isAdmin() || isTopAdmin()
                ],
                edit: [
                    () => isAdmin() || isTopAdmin()
                ],
                delete: [
                    () => isTopAdmin()
                ]
            }
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
            },
            permissions: {
                create: [
                    () => isAdmin() || isTopAdmin()
                ],
                edit: [
                    () => isAdmin() || isTopAdmin()
                ],
                delete: [
                    () => isTopAdmin()
                ]
            }
        },

        'settings': {
            module: [],
            permissions: {
                create: [],
                edit: [],
                delete: []
            }
        },
        'settings/customize': {
            module: [
                () => isAdmin() || isTopAdmin()
            ],
            permissions: {
                create: [
                    () => isAdmin() || isTopAdmin()
                ],
                edit: [
                    () => isAdmin() || isTopAdmin()
                ],
                delete: [
                    () => isTopAdmin()
                ]
            }
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
            ],
            permissions: {
                create: [
                    () => isAdmin() || isTopAdmin()
                ],
                edit: [
                    () => isAdmin() || isTopAdmin()
                ],
                delete: [
                    () => isTopAdmin()
                ]
            }
        },
    }

    private menuPermissions: Record<string, MenuPermission> = {
        [text.home.href]: {
            canView: () => true
        },

        [text.student.href]: {
            canView: () => isTopAdmin() || isEnroll() || isTeacher()
        },

        [text.guardian.href]: {
            canView: () => isTopAdmin() || isFinance() || isTeacher()
        },

        [text.teacher.href]: {
            canView: () => isTopAdmin() || isFinance() || isHR()
        },

        [text.cc.href]: {
            canView: () => isTopAdmin() || isAdmin() || isSecretary() || isTeacher()
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
            canView: () => true
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
            console.warn("User has no roles assigned, denying access")
            return false
        }

        if (isTopAdmin()) {
            return true
        }

        const {fullRoute, module: moduleName, action} = this.extractRouteWithoutSchoolSlug(pathname)

        let moduleConfig = this.routeAccessMap[fullRoute]

        if (!moduleConfig) {
            moduleConfig = this.routeAccessMap[moduleName]
        }

        if (!moduleConfig) {
            for (const [routePattern, config] of Object.entries(this.routeAccessMap)) {
                if (fullRoute.startsWith(routePattern + '/') || fullRoute === routePattern) {
                    moduleConfig = config
                    break
                }
            }

            if (!moduleConfig) {
                console.warn("No access configuration found for route: " + fullRoute + ' denying access')
                return false
            }
        }

        return this.checkModuleAndAction(moduleConfig, action, moduleName, fullRoute)
    }

    /**
     * NEW METHOD: Check if a user can perform a specific permission action
     *
     * This is the core method for checking fine-grained permissions. It answers
     * questions like "can this user create students?" or "can this user delete teachers?"
     *
     * @param module - The module name (e.g., 'students', 'teachers')
     * @param permission - The permission type ('view', 'create', 'edit', 'delete') or special action name
     * @param excludeToAdmin - In rare case, we will need to exclude Top Admins, we will give it a true value
     * @returns boolean - true if user has this permission
     *
     * Usage in your components:
     * if (routeAccess.can('students', 'create')) {
     *   // Show "Add New Student" button
     * }
     */
    public can(module: string, permission: string, excludeToAdmin: boolean = false): boolean {
        // Top admins can do everything, always
        if (isTopAdmin() && !excludeToAdmin) {
            return true
        }

        const config = this.routeAccessMap[module]

        if (!config || !config.permissions) {
            console.warn(`No permission configuration found for module: ${module}`)
            return false
        }

        const permissions = config.permissions

        // Check if it's a standard permission (view, create, edit, delete)
        if (permission in permissions && permission !== 'special') {
            const checkers = permissions[permission as keyof Omit<ModulePermissions, 'special'>]

            if (checkers.length === 0) {
                return true
            }

            return checkers.some(checker => checker())
        }

        // Check if it's a special action
        if (permissions.special && permissions.special[permission]) {
            const checkers = permissions.special[permission]

            if (checkers.length === 0) {
                return true
            }

            return checkers.some(checker => checker())
        }

        console.warn(`No permission checker found for '${permission}' in module '${module}'`)
        return false
    }

    /**
     * NEW METHOD: Check if a user has view-only access
     *
     * View-only means the user can see data but cannot create, edit, or delete.
     * This is useful for showing read-only versions of forms or disabling edit buttons.
     *
     * Example: A teacher viewing student information is view-only because they can
     * see the students but cannot modify their records.
     */
    public isViewOnly(module: string): boolean {
        if (isTopAdmin()) {
            return false
        }

        const canCreate = this.can(module, 'create')
        const canEdit = this.can(module, 'edit')
        const canDelete = this.can(module, 'delete')

        return !canCreate && !canEdit && !canDelete
    }

    /**
     * NEW METHOD: Check if user can view and edit
     *
     * This checks if the user has both view and edit permissions, which is useful
     * for enabling form fields or showing edit buttons without delete capabilities.
     */
    public canViewAndEdit(module: string): boolean {
        return this.can(module, 'edit')
    }

    /**
     * NEW METHOD: Check if user has full access
     *
     * Full access means the user can view, create, edit, and delete everything.
     * This is typically only true for administrators.
     */
    public hasFullAccess(module: string): boolean {
        if (isTopAdmin()) {
            return true
        }

        return (
            this.can(module, 'create') &&
            this.can(module, 'edit') &&
            this.can(module, 'delete')
        )
    }

    /**
     * Get permission level for a module
     *
     * This returns the highest permission level the user has in a module.
     * Useful for showing appropriate UI elements based on overall access level.
     *
     * @param module - The module name
     * @returns PermissionLevel - The highest permission level the user has
     */
    public getPermissionLevel(module: string): PermissionLevel {
        if (this.hasFullAccess(module)) {
            return PermissionLevel.FULL
        }

        if (this.can(module, 'delete')) {
            return PermissionLevel.DELETE
        }

        if (this.can(module, 'edit')) {
            return PermissionLevel.EDIT
        }

        if (this.can(module, 'create')) {
            return PermissionLevel.CREATE
        }

        return PermissionLevel.NONE
    }

    /**
     * NEW METHOD: Get a summary of permissions
     *
     * This returns an object showing all permissions a user has for a module.
     * Useful for debugging or showing users what they can do.
     */
    public getPermissionSummary(module: string) {
        return {
            module,
            canCreate: this.can(module, 'create'),
            canEdit: this.can(module, 'edit'),
            canDelete: this.can(module, 'delete'),
            isViewOnly: this.isViewOnly(module),
            canViewAndEdit: this.canViewAndEdit(module),
            hasFullAccess: this.hasFullAccess(module)
        }
    }

    public filterMenuItems (items: ItemType[]): ItemType[] {
        return items.map(item => {
            if (!item || typeof item !== "object" || !('key' in item)) {
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

    private checkModuleAndAction (config: RouteAccessMap, action: string, moduleName: string, fullRoute: string): boolean {
        if (config.module && config.module.length > 0) {
            const hasModuleAccess = config.module.some(checker => checker())
            if (!hasModuleAccess) {
                console.warn(`Module access denied for: ${moduleName}`)
                return false
            }
        }

        if (action && config.actions) {
            if (config.actions[action]) {
                const actionCheckers = config.actions[action]

                if (actionCheckers.length === 0) {
                    return true
                }

                const hasActionAccess = actionCheckers.some(checker => checker())
                if (!hasActionAccess) {
                    console.warn(`Action access denied for: ${fullRoute}`)
                    return false
                }
                return true
            }

            // Try pattern matching for dynamic routes (like :id, :slug)
            for (const [actionPattern, checkers] of Object.entries(config.actions)) {
                if (actionPattern.includes(':')) {
                    // Convert route pattern to regex (simple version)
                    // :id, :slug, etc. match any segment
                    const regexPattern = actionPattern.replace(/:[^/]+/g, '[^/]+')
                    const regex = new RegExp(`^${regexPattern}$`)

                    if (regex.test(action)) {
                        if (checkers.length === 0) {
                            return true
                        }
                        const hasActionAccess = checkers.some(checker => checker())
                        if (!hasActionAccess) {
                            console.log(`Pattern action access denied for: ${fullRoute}`)
                            return false
                        }
                        return true
                    }
                }
            }

            console.warn(`No action configuration found for: ${action} in ${moduleName}, denying access`)
            return false
        }

        // No action specified, just accessing the module itself - allow if module access passed
        return true
    }

    private canViewMenuItem (menuKey: string): boolean {
        if (isTopAdmin()) {
            return true
        }

        const permission = this.menuPermissions[menuKey]

        if (!permission) {
            return false
        }

        return permission.canView()
    }
}

export const routeAccess = new RouteAccess()