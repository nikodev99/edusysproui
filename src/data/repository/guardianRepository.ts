import {AxiosResponse} from "axios";
import {Guardian} from "../../entity";
import {apiClient, request} from "../axiosConfig.ts";

export const getEnrolledStudentsGuardians = (page: number, size: number, sortCriteria?: string): Promise<AxiosResponse<Guardian[]>> => {
    return apiClient.get<Guardian[]>("/enroll/guardians", {
        params: {
            page: page,
            size: size,
            sortCriteria: sortCriteria ? sortCriteria : null
        }
    })
}

export const getSearchedEnrolledStudentGuardian = (searchInput: string) => {
    return request({
        method: 'GET',
        url: '/enroll/guardians/search/',
        params: {
            q: searchInput
        }
    })
}

export const getGuardianById = (guardianId: string): Promise<AxiosResponse<Guardian>> => {
    return apiClient.get<Guardian>(`/guardian/${guardianId}`)
}