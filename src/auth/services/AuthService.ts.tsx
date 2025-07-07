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
    }
}

export const refreshToken = async () => {
    const refreshToken = loggedUser.getRefreshToken()
    if (!refreshToken) return false

    try {
        const response = await apiClient.post<UserProfileToken>('/auth/refresh', {refreshToken})
        if (response.status >= 200 && response.status <= 300) {
            const data = response.data
            loggedUser.setToken(data.accessToken)
            loggedUser.setRefreshToken(data.refreshToken)
            return true
        }
    }catch (error) {
        handleError(error)
    }
    return false
}

export const signupApi = async (data: SignupRequest) => {
    try {
        return await apiClient.post<UserProfileToken>('/auth/signup', data)
    }catch (error) {
        handleError(error)
    }
}

export const logoutApi = async () => {
    const refreshToken = loggedUser.getRefreshToken()
    await apiClient.post('/auth/logout', {refreshToken})
}