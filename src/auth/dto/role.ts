export enum RoleEnum {
    ADMIN = 'ADMINISTRATEUR',
    TOP_ADMIN = 'TOP ADMINISTRATEUR',
    USER = 'UTILISATEUR',
    TEACHER = 'PROFESSEUR',
    SECRETARY = 'SECRETAIRE',
    DIRECTOR = 'DIRECTEUR',
    GUARDIAN = 'TUTEUR'
}

export type Role = keyof typeof RoleEnum;

export const isAdmin = (roles: Role[]): boolean => {
    return roles?.some(role => role === 'ADMIN' || role === 'TOP_ADMIN' || role === 'DIRECTOR');
}

export const isTeacher = (roles: Role[]): boolean => {
    return roles?.some(role => role === 'TEACHER');
}

export const isUser = (roles: Role[]): boolean => {
    return roles?.some(role => role === 'USER');
}

export const secretary = (roles: Role[]): boolean => {
    return roles?.some(role => role === 'SECRETARY');
}

export const isGuardian = (roles: Role[]): boolean => {
    return roles?.some(role => role === 'GUARDIAN');
}