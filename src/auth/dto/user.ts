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
    roles: Role[]
    school: School
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
    roles: Role[]
}

export interface UserProfile {
    user: Individual
}