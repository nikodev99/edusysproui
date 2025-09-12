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
    roles: Role[]
    user: UserProfile
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

export enum UserType {
    EMPLOYEE, GUARDIAN, TEACHER
}

export const toUser = (profil: UserProfileToken): UserProfile => ({
    ...profil?.user,
    email: profil?.email,
    username: profil?.username,
    phoneNumber: profil?.phoneNumber,
    roles: profil?.roles
});