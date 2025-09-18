import {LoginRequest, UserProfile} from "../auth/dto/user.ts";
import React, {createContext} from "react";
import {School} from "../entity";
import {SignupSchema} from "../schema";
import {AxiosResponse} from "axios";

export type UserAuthContext = {
    user: UserProfile | null,
    token: string | null
    refreshToken: string | null
    userSchool: School | null

    registerUser: (data: SignupSchema) => Promise<AxiosResponse<SignupSchema>> | false
    loginUser: (data: LoginRequest) => Promise<boolean>
    refresh: () => Promise<boolean>
    logoutUser: () => void
    isLoggedIn: () => boolean
    shouldRedirectToHome: () => boolean
    shouldPickSchool: () => boolean

    loginError: { type: string | null, message: string | null } | null
    clearLoginError: () => void
}

export type UserContextProps = {children: React.ReactNode}

export const UserContext = createContext<UserAuthContext>({} as UserAuthContext)