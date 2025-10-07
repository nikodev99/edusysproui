import {Role} from "./role.ts";
import {Individual, School} from "../../entity";

export interface UserProfileToken {
    accessToken: string
    refreshToken: string
    userAgent: string
    tokenType: string
    id: number
    username: string
    email: string
    phoneNumber: string
    enabled: boolean
    accountNonLocked: boolean
    roles: Role[]
    accountId: number
    user: UserProfile
}

export interface UserActiveLogin {
    loginId: number
    accountId: number
    clientIp: string
    createdAt: string | number | Date
    lastUsedAt: string | number | Date
    expiryAt: string | number | Date
    device: string
    browser: string
    token: string
}

export interface LoginRequest {
    username: string
    password: string
}

export interface SignupRequest {
    username: string
    email: string
    password: string
    phoneNumber: string
    personalInfo: Individual
    userType: UserType
    roles: Role[]
}

export interface UserProfile {
    userId: string
    accountId: number
    firstName: string
    lastName: string
    username: string
    email: string
    phoneNumber: string
    userType: UserType
    roles: Role[]
    schools: School[]
}

export interface User {
    id: number
    account: number
    username: string
    email: string
    firstName: string
    lastName: string
    roles: Role[]
    phoneNumber: string
    enabled: boolean
    accountNonLocked: boolean
    failedLoginAttempts: number
    lastLogin: Date | number | string
    userType: UserType
    createdAt: Date | number | string
    updatedAt: Date | number | string
}

export interface UserActivity {
    id?: number
    action: string
    actionDate?: Date | number[] | string
    ipAddress?: string
    description: string
    accountId?: number
}

export enum UserType {
    EMPLOYEE, GUARDIAN, TEACHER
}

export interface ResetPasswordRequest {
    token: number
    newPassword: string
}

export interface ChangePasswordRequest {
    userId: number
    oldPassword: string
    newPassword: string
}

export const toUser = (profil: UserProfileToken): UserProfile => ({
    ...profil?.user,
    accountId: profil?.accountId,
    email: profil?.email,
    username: profil?.username,
    phoneNumber: profil?.phoneNumber,
    roles: profil?.roles
});