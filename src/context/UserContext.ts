import {LoginRequest, SignupRequest, UserProfile} from "../auth/dto/user.ts";
import React, {createContext} from "react";
import {School} from "../entity";

export type UserAuthContext = {
    user: UserProfile | null,
    token: string | null
    refreshToken: string | null
    userSchools: School | null

    registerUser: (data: SignupRequest) => Promise<boolean>
    loginUser: (data: LoginRequest) => Promise<boolean>
    logoutUser: () => void
    isLoggedIn: () => boolean
    shouldRedirectToHome: boolean
    clearRedirectFlag: () => void

    loginError: string | null
    clearLoginError: () => void
}

export type UserContextProps = {children: React.ReactNode}

export const UserContext = createContext<UserAuthContext>({} as UserAuthContext)