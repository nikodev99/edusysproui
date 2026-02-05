import {loggedUser} from "@/auth/jwt/LoggedUser.ts";

export enum RoleEnum {
    TOP_ADMIN = 'Top Administrateur',
    ADMIN = 'Responsable Informatique',
    DIRECTOR = "Responsable de l'établissement",
    HR = "Responsable Resource Humain",
    FINANCE = "Responsable Finance",
    ENROLL = "Responsable Inscription Reinscription",
    TEACHER = 'Professeur, Enseignant, Educateur',
    GUARDIAN = 'Tuteur, Parent',
    SECRETARY = 'Sécretaire'
}

export type Role = keyof typeof RoleEnum;

const hasRole = (roles: Role[]) => {
    const userRoles = loggedUser.getRole()
    if (!userRoles || userRoles?.length === 0)
        return false
    return userRoles.some(userRole => roles.includes(userRole))
}

export const createRoleChecker = (...roles: Role[]) => {
    return () => hasRole(roles)
}

export const isTopAdmin = createRoleChecker("TOP_ADMIN", "DIRECTOR")
export const isAdmin = createRoleChecker("ADMIN")
export const isTeacher = createRoleChecker("TEACHER")
export const isHR = createRoleChecker("HR")
export const isFinance = createRoleChecker("FINANCE")
export const isEnroll = createRoleChecker("ENROLL")
export const isGuardian = createRoleChecker("GUARDIAN")
export const isSecretary = createRoleChecker("SECRETARY")
export const isEmploye = createRoleChecker("HR", "FINANCE", "ENROLL", "SECRETARY")