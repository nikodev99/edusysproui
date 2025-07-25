import {apiClient} from "../axiosConfig.ts";
import {User} from "../../auth/dto/user.ts";

export const getAllUsers = (schoolId: string) => {
    return apiClient.get<User>(`/users/${schoolId}`)
}

export const countAllUsers = (schoolId: string) => {
    return apiClient.get<number>(`/users/count_${schoolId}`)
}