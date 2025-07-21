export enum RoleEnum {
    ADMIN = 'ADMIN',
    TOP_ADMIN = 'TOP_ADMIN',
    USER = 'UTILISATEUR',
    TEACHER = 'PROFESSEUR',
    SECRETARY = 'SECRETAIRE',
    DIRECTOR = 'DIRECTEUR',
    GUARDIAN = 'TUTEUR'
}

export type Role = keyof typeof RoleEnum;