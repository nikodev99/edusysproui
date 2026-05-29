import {loggedUser} from "@/auth/jwt/LoggedUser.ts";
import {enumHelper} from "@/core/helpers/enumHelpers.ts";

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

export const createRoleChecker = (...roles: Role[]) => {
    return () => enumHelper.createMultipleChecker(loggedUser.getRole(), ...roles)
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