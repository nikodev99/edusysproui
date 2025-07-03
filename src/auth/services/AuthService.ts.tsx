import {apiClient, handleError} from "../../data/axiosConfig.ts";
import {LoginRequest, SignupRequest, UserProfileToken} from "../dto/user.ts";
import LocalStorageManager from "../../core/LocalStorageManager.ts";
import {jwt} from "../../core/utils/text_display.ts";

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
    const refreshToken = LocalStorageManager.get<string>(jwt.refreshTokenKey)
    if (!refreshToken) return false

    try {
        const response = await apiClient.post<UserProfileToken>('/refresh', {refreshToken})
        if (response.status >= 200 && response.status <= 300) {
            const data = response.data
            LocalStorageManager.save(jwt.tokenKey, data.accessToken)
            LocalStorageManager.save(jwt.refreshTokenKey, data.refreshToken)
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
    const refreshToken = LocalStorageManager.get<string>(jwt.refreshTokenKey)
    await apiClient.post('/auth/logout', {refreshToken})
}