import {apiClient} from "../axiosConfig.ts";
import {User} from "../../auth/dto/user.ts";
import {Pageable} from "../../core/utils/interfaces.ts";

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

export const countAllUsers = (schoolId: string) => {
    return apiClient.get<number>(`/users/count_${schoolId}`)
}