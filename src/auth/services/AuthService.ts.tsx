import {apiClient, handleError} from "../../data/axiosConfig.ts";
import {LoginRequest, UserProfileToken} from "../dto/user.ts";
import {loggedUser} from "../jwt/LoggedUser.ts";
import {SignupSchema} from "../../schema";

export const loginApi = async (login: LoginRequest) => {
    try {
        return await apiClient.post<UserProfileToken>('/auth/login', {
            username: login.username,
            password: login.password
        })
    }catch (error) {
        return false
    }
}

export const tokenRefresh = async () => {
    const refreshToken = loggedUser.getRefreshToken()
    if (!refreshToken)
        throw new Error('No refresh token found')

    try {
        return await apiClient.post<UserProfileToken>('/auth/refresh', {refreshToken: refreshToken})
    }catch (error) {
        console.error('Token refresh API call failed:', error)
        throw error
    }
}

export const signupApi = async (data: SignupSchema) => {
    console.log("DATA: ", data)

    try {
        return await apiClient.post<SignupSchema>('/auth/register', data)
    }catch (error) {
        handleError(error)
        throw error
    }
}

export const userExists = async (personalInfoId: number) => {
    try {
        return await apiClient.get<boolean>('/auth/user/' + personalInfoId)
    }catch (error) {
        handleError(error)
        throw error
    }
}

export const logoutApi = async () => {
    const refreshToken = loggedUser.getRefreshToken()
    await apiClient.post('/auth/logout', {refreshToken: refreshToken})
}