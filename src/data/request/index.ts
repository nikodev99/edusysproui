import {apiClient, request} from "../axiosConfig.ts";
import {Classe, Guardian} from "../../entity";
import {AxiosResponse} from "axios";

export const getClassesBasicValues = (): Promise<AxiosResponse<Classe[]>> => {
    return apiClient.get<Classe[]>("/classes/basic");
}

export const getEnrolledStudentsGuardians = (): Promise<AxiosResponse<Guardian[]>> => {
    return apiClient.get<Guardian[]>("/enroll/guardians")
}

export const getGuardianById = (guardianId: string): Promise<AxiosResponse<Guardian>> => {
    return apiClient.get<Guardian>(`/guardian/${guardianId}`)
}

export const getEnrolledStudents = (page: number, size: number, sortCriteria?: string) => {
    if (sortCriteria) {
        return request({
            method: 'GET',
            url: '/enroll',
            params: {
                page: page,
                size: size,
                sortCriteria: `${sortCriteria},e.enrollmentDate:desc`
            }
        })
    }
    return request({
        method: 'GET',
        url: '/enroll',
        params: {
            page: page,
            size: size,
            sortCriteria: 'e.enrollmentDate:desc'
        }
    })
}