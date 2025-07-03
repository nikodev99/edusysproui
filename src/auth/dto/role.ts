export enum RoleEnum {
    ADMIN, TOP_ADMIN, USER, TEACHER, SECRETARY, DIRECTOR
}

export type Role = keyof typeof RoleEnum;