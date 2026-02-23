import {apiClient, handleError} from "@/data/axiosConfig.ts";
import {LoginRequest, ResetPasswordRequest, User, UserProfileToken} from "../dto/user.ts";
import {loggedUser} from "../jwt/LoggedUser.ts";
import {AssignUserToSchoolSchema, SchoolSelectionSchema, SignupSchema} from "@/schema";
import {MessageResponse} from "@/core/utils/interfaces.ts";

export const loginApi = async (login: LoginRequest) => {
    return await apiClient.post<UserProfileToken>('/auth/login', {
        username: login.username,
        password: login.password
    })
}

export const loginToSchool = async (schoolData: SchoolSelectionSchema) => {
    return await apiClient.post<UserProfileToken>('/auth/select_school/', schoolData)
}

export const tokenRefresh = async () => {
    const refreshToken = loggedUser.getRefreshToken()
    const school = loggedUser.getSchool()
    if (!refreshToken)
        throw new Error('No refresh token found')

    try {
        return await apiClient.post<UserProfileToken>('/auth/refresh', {refreshToken: refreshToken, schoolId: school?.id})
    }catch (error) {
        console.error('Token refresh API call failed:', error)
        throw error
    }
}

export const tokenChange = async () => {
    const refreshToken = loggedUser.getRefreshToken()
    if (!refreshToken)
        throw new Error('No refresh token found')

    try {
        return await apiClient.post<UserProfileToken>('/auth/unscope/', {refreshToken: refreshToken, schoolId: null})
    }catch (error) {
        console.error('Token change API call failed:', error)
        throw error
    }
}

export const signupApi = async (data: SignupSchema) => {
    try {
        return await apiClient.post<SignupSchema>('/auth/register', data)
    }catch (error) {
        handleError(error)
        throw error
    }
}

export const assignToUser = async (data: AssignUserToSchoolSchema) => {
    try {
        console.log({newUser: data})
        return await apiClient.post<MessageResponse>('/auth/register-new-school', data)
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

export const userExistsInSchool = async (schoolId: string, personalInfoId: number) => {
    try {
        return await apiClient.get<boolean>(`/auth/account/${schoolId}/${personalInfoId}`)
    }catch (error) {
        handleError(error)
        throw error
    }
}

export const logoutApi = async () => {
    const refreshToken = loggedUser.getRefreshToken()
    await apiClient.post('/auth/logout', {refreshToken: refreshToken})
}

export const resetPasswordRequest = async (userId: number) => {
    return await apiClient.post<MessageResponse>('/auth/password-reset/' + userId)
}

export const validateToken = async (token: string) => {
    return await apiClient.get<User | MessageResponse>('/auth/validate-token/' + token)
}

export const resetPassword = async (request: ResetPasswordRequest) => {
    return await apiClient.post<MessageResponse>('/auth/reset', request)
}