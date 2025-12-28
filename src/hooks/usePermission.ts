import {useMemo} from "react";
import {routeAccess} from "@/middleware/routeAccess.ts";
import {useLocation} from "react-router-dom";

/**
 * React Hook: usePermissions
 *
 * This hook provides a clean interface to check what the current user can do
 * in a specific module. It works with your existing RouteAccess class and
 * automatically handles all the permission logic.
 *
 * Think of it as asking "what can I do in this room?" Once you're inside a module
 * (passed the route guard), this hook tells you which buttons to show, which
 * fields to enable, and which actions the user can perform.
 *
 * @returns Object with permission flags and helper methods
 *
 * @example
 * function StudentListPage() {
 *   const permissions = usePermissions('students');
 *
 *   return<div>
 *    {permissions.canCreate && <Button>Add Student</Button>}
 *    {permissions.canEdit && <Button>Edit</Button>}
 *    {permissions.can('export') && <Button>Export</Button>}
 *  </div>;
 * }
 */
export const usePermission = () => {
    const location = useLocation()
    const {module} = routeAccess.extractRouteWithoutSchoolSlug(location.pathname)

    return useMemo(() => ({
        canCreate: routeAccess.can(module, 'create'),
        canEdit: routeAccess.can(module, 'edit'),
        canDelete: routeAccess.can(module, 'delete'),

        // Composite permissions - useful for complex UI logic
        isViewOnly: routeAccess.isViewOnly(module),
        canViewAndEdit: routeAccess.canViewAndEdit(module),
        hasFullAccess: routeAccess.hasFullAccess(module),

        // Generic permission checker for special actions
        // Use this for module-specific actions like 'export', 'approve', etc.
        can: (action: string, exclude: boolean = false) => routeAccess.can(module, action, exclude),

        // Get a full summary-useful for debugging
        summary: routeAccess.getPermissionSummary(module),
        level: routeAccess.getPermissionLevel(module)
    }), [module])
}

/**
 * React Hook: useModulePermission
 *
 * A simpler, more focused hook for when you only need to check one specific
 * permission. This is more performant than usePermissions when you don't need
 * all the permission flags at once.
 *
 * This hook is perfect for conditional rendering of single elements like buttons
 * or links, where you only care about one specific capability.
 *
 * @param module - The module name
 * @param action - The action to check ('view', 'create', 'edit', 'delete', or custom)
 * @returns boolean - true if user has this permission
 *
 * @example
 * function DeleteButton({ studentId }) {
 *   const canDelete = useModulePermission('students', 'delete');
 *
 *   if (!canDelete) returns null;
 *
 *   return <Button danger onClick={() => handleDelete(studentId)}>
 *       Delete
 *   </Button>;
 * }
 */
export const useModulePermission = (module: string, action: string): boolean => {
    return useMemo(() => {
        return routeAccess.can(module, action);
    }, [module, action]);
}

/**
 * React Hook: useIsViewOnly
 *
 * Quick hook to check if the user has view-only access to a module.
 * This is particularly useful for form components where you want to show
 * data but disable all input fields if the user can only view.
 *
 * A user is "view only" when they can see the data but cannot create, edit,
 * or delete anything. This is common for roles like teachers viewing student
 * records - they need to see the information but shouldn't be able to change it.
 *
 * @param module - The module name
 * @returns boolean - true if user can only view (cannot modify)
 *
 * @example
 * function StudentForm({ student }) {
 *   const isViewOnly = useIsViewOnly('students');
 *
 *   if (isViewOnly) {
 *     return <StudentDetailsReadOnly student={student} />;
 *   }
 *
 *   return <StudentFormEditable student={student} />;
 * }
 */
export function useIsViewOnly(module: string): boolean {
    return useMemo(() => {
        return routeAccess.isViewOnly(module);
    }, [module]);
}

/**
 * React Hook: useCanViewAndEdit
 *
 * Quick hook to check if the user can both view and edit a module.
 * This is useful for showing edit controls or enabling form fields without
 * showing delete buttons (which require a higher permission level).
 *
 * This represents a "medium" permission level - the user can see and modify
 * data but might not be able to create new records or delete existing ones.
 *
 * @param module - The module name
 * @returns boolean - true if user can view and edit
 *
 * @example
 * function StudentDetails({ student }) {
 *   const canEdit = useCanViewAndEdit('students');
 *
 *   return <div>
 *       <h1>{student.name}</h1>
 *       {canEdit && <Link to={`/students/${student.id}/edit`}>
 *           Edit Profile
 *         </Link>
 *       }
 *   </div>;
 * }
 */
export function useCanViewAndEdit(module: string): boolean {
    return useMemo(() => {
        return routeAccess.canViewAndEdit(module);
    }, [module]);
}

/**
 * React Hook: useHasFullAccess
 *
 * Check if the user has complete access to a module (all CRUD operations).
 * This is useful when you want to show admin-only features or enable
 * all controls for users with full permissions.
 *
 * Full access means the user can view, create, edit, and delete. This is
 * typically only true for administrators or users with special privileges.
 *
 * @param module - The module name
 * @returns boolean - true if user has full access
 *
 * @example
 * function StudentManagement() {
 *   const hasFullAccess = useHasFullAccess('students');
 *
 *   return <div>
 *    <StudentList />
 *    {hasFullAccess &&
 *      <AdminPanel>
 *        <Button>Bulk Import</Button>
 *        <Button>Generate Reports</Button>
 *        <Button>Archive All</Button>
 *      </AdminPanel>}
 *   </div>;
 * }
 */
export function useHasFullAccess(module: string): boolean {
    return useMemo(() => {
        return routeAccess.hasFullAccess(module);
    }, [module]);
}
