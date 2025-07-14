import {apiClient, handleError} from "../../data/axiosConfig.ts";
import {LoginRequest, SignupRequest, UserProfileToken} from "../dto/user.ts";
import {loggedUser} from "../jwt/LoggedUser.ts";

export const loginApi = async (login: LoginRequest) => {
    try {
        return await apiClient.post<UserProfileToken>('/auth/login', {
            username: login.username,
            password: login.password
        })
    }catch (error) {
        handleError(error)
        throw error
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

export const signupApi = async (data: SignupRequest) => {
    try {
        return await apiClient.post<UserProfileToken>('/auth/signup', data)
    }catch (error) {
        handleError(error)
        throw error
    }
}

export const logoutApi = async () => {
    const refreshToken = loggedUser.getRefreshToken()
    await apiClient.post('/auth/logout', {refreshToken: refreshToken})
}