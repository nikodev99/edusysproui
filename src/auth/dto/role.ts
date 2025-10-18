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

export const isTopAdmin = (roles: Role[]): boolean => {
    return roles?.some(role => role === 'TOP_ADMIN' || role === 'DIRECTOR');
}

export const isAdmin = (roles: Role[]): boolean => {
    return roles?.some(role => role === 'ADMIN');
}

export const isTeacher = (roles: Role[]): boolean => {
    return roles?.some(role => role === 'TEACHER');
}

export const isHR = (roles: Role[]): boolean => {
    return roles?.some(role => role === 'HR');
}

export const isFinance = (roles: Role[]): boolean => {
    return roles?.some(role => role === 'FINANCE');
}

export const isEnroll = (roles: Role[]): boolean => {
    return roles?.some(role => role === 'ENROLL');
}

export const isGuardian = (roles: Role[]): boolean => {
    return roles?.some(role => role === 'GUARDIAN');
}

export const isSecretary = (roles: Role[]): boolean => {
    return roles?.some(role => role === 'SECRETARY');
}