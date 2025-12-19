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

const userRoles = loggedUser.getRole()

export const isTopAdmin = (): boolean => {
    return userRoles?.some(role => role === 'TOP_ADMIN' || role === 'DIRECTOR') || false;
}

export const isAdmin = (): boolean => {
    return userRoles?.some(role => role === 'ADMIN') || false;
}

export const isTeacher = (): boolean => {
    return userRoles?.some(role => role === 'TEACHER') || false;
}

export const isHR = (): boolean => {
    return userRoles?.some(role => role === 'HR') || false;
}

export const isFinance = (): boolean => {
    return userRoles?.some(role => role === 'FINANCE') || false;
}

export const isEnroll = (): boolean => {
    return userRoles?.some(role => role === 'ENROLL') || false;
}

export const isGuardian = (): boolean => {
    return userRoles?.some(role => role === 'GUARDIAN') || false;
}

export const isSecretary = (): boolean => {
    return userRoles?.some(role => role === 'SECRETARY') || false;
}