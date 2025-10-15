import {Role} from "./role.ts";
import {Individual, School} from "../../entity";
import {setTitle} from "../../core/utils/utils.ts";
import {useMemo} from "react";
import {z} from "zod";

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
    passwordConfirm: string
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

export const passwordResetRequest = z.object({
    token: z.string().optional(),
    newPassword: z.string({required_error: 'Le nouveau mot de passe est requis'})
        .min(6, {message: "Le nouveau mot de passe doit contenir au moins 6 characters"})
        .max(50, {message: "Le nouveau mot de passe doit contenir au plus 50 characters"})
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{}|;:,.<>?/])[A-Za-z\d!@#$%^&*()-_=+{}|;:,.<>?/]{6,100}$/, {
            message: "Le nouveau mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial."
        })
})

export type ResetPasswordRequest = z.infer<typeof passwordResetRequest>

export const passwordChangeRequest = z.object({
    userId: z.number().optional(),
    oldPassword: z.string({required_error: 'L\'ancien mot de passe est requis'})
        .min(6, {message: "L'ancien mot de passe doit contenir au moins 6 characters"})
        .max(50, {message: "L'ancien mot de passe doit contenir au plus 50 characters"})
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{}|;:,.<>?/])[A-Za-z\d!@#$%^&*()-_=+{}|;:,.<>?/]{6,100}$/, {
            message: "L'ancien mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial."
        }),
    newPassword: z.string({required_error: 'Le nouveau mot de passe est requis'})
        .min(6, {message: "Le nouveau mot de passe doit contenir au moins 6 characters"})
        .max(50, {message: "Le nouveau mot de passe doit contenir au plus 50 characters"})
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{}|;:,.<>?/])[A-Za-z\d!@#$%^&*()-_=+{}|;:,.<>?/]{6,100}$/, {
            message: "Le nouveau mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial."
        })
}).refine(data => data.newPassword !== data.oldPassword, {
    message: 'Le nouveau mot de passe ne peut pas être le même que l\'ancien mot de passe',
    path: ['newPassword']
})

export type ChangePasswordRequest = z.infer<typeof passwordChangeRequest>

export const toUser = (profil: UserProfileToken): UserProfile => ({
    ...profil?.user,
    accountId: profil?.accountId,
    email: profil?.email,
    username: profil?.username,
    phoneNumber: profil?.phoneNumber,
    roles: profil?.roles
});

export const useName = (user?: User) => {
    return useMemo(() =>
            setTitle({firstName: user?.firstName, lastName: user?.lastName}),
        [user?.firstName, user?.lastName]
    )
}