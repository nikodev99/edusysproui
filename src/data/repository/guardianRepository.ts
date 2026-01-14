import {AxiosResponse} from "axios";
import {Guardian} from "@/entity";
import {apiClient, request} from "../axiosConfig.ts";
import {GuardianSchema} from "@/schema";

export const changeGuardian = (data: GuardianSchema, student: string) => {
    return apiClient.post<Guardian>(`/student/${student}`, data)
}

export const getEnrolledStudentsGuardians = (schoolId: string, page: number, size: number, sortCriteria?: string): Promise<AxiosResponse<Guardian[]>> => {
    return apiClient.get<Guardian[]>("/enroll/guardians/" + schoolId, {
        params: {
            page: page,
            size: size,
            sortCriteria: sortCriteria ? sortCriteria : null
        }
    })
}

export const getSearchedEnrolledStudentGuardian = (schoolId: string, searchInput: string) => {
    return request({
        method: 'GET',
        url: '/enroll/guardians/search/' + schoolId,
        params: {
            q: searchInput
        }
    })
}

export const getGuardianById = (guardianId: string): Promise<AxiosResponse<Guardian>> => {
    return apiClient.get<Guardian>(`/guardian/${guardianId}`)
}

export const getGuardianWithStudentsById = (guardianId: string): Promise<AxiosResponse<Guardian>> => {
    return apiClient.get<Guardian>(`/guardian/withStudent/${guardianId}`)
}