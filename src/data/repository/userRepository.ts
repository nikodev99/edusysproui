import {apiClient} from "../axiosConfig.ts";
import {ChangePasswordRequest, User, UserActiveLogin, UserActivity} from "../../auth/dto/user.ts";
import {MessageResponse, Pageable} from "../../core/utils/interfaces.ts";
import {Role} from "../../auth/dto/role.ts";

export const getAllUsers = (schoolId: string, pageable: Pageable, sortCriteria?: string) => {
    return apiClient.get<User>(`/users/${schoolId}`, {
        params: {
            page: pageable?.page,
            size: pageable?.size,
            sortCriteria: sortCriteria,
        }
    })
}

export const getAllSearchedUsers = async (schoolId: string, input: string) => {
    return await apiClient.get<User>(`/users/${schoolId}/`, {
        params: {
            query: input
        }
    })
}

export const getAllUserLogins = (accountId: number) => {
    return apiClient.get<UserActiveLogin[]>(`/users/all_logins/${accountId}`)
}

export const getUserLogin = (accountId: number) => {
    return apiClient.get<UserActiveLogin>(`/users/login/${accountId}`)
}

export const sessionLogout = (sessionId?: number) => {
    return apiClient.post<MessageResponse>(`/users/logout/${sessionId}`)
}

export const getUserById = (userId: number, schoolId: string) => {
    return apiClient.get<User>(`/users/${userId}/${schoolId}`)
}

export const saveUserActivity = (activity: UserActivity) => {
    return apiClient.post<UserActivity>(`/users/activity`, activity)
}

export const getUserActivities = (accountId: number) => {
    return apiClient.get<UserActivity>(`/users/activity/${accountId}`)
}

export const countAllUsers = (schoolId: string) => {
    return apiClient.get<number>(`/users/count_${schoolId}`)
}

export const setAccountRoles = (accountId: number, roles: Role[]) => {
    return apiClient.patch(`/users/role/${accountId}`, {field: 'roles', value: roles})
}

export const setEnableAccount = (accountId: number) => {
    return apiClient.patch(`/users/enable/${accountId}`, {field: 'enabled', value: true})
}

export const setDisableAccount = (accountId: number) => {
    return apiClient.patch(`/users/enable/${accountId}`, {field: 'enabled', value: false})
}

export const setLockAccount = (accountId: number) => {
    return apiClient.patch(`/users/lock/${accountId}`, {field: 'accountNonLocked', value: true})
}

export const setUnlockAccount = (accountId: number) => {
    return apiClient.patch(`/users/lock/${accountId}`, {field: 'accountNonLocked', value: false})
}

export const removeUserAccount = (accountId: number) => {
    return apiClient.patch(`/users/remove/${accountId}`, {field: 'isActive', value: false})
}

export const changePassword = async (request: ChangePasswordRequest) => {
    return await apiClient.post<MessageResponse>('/users/change-password', request)
}