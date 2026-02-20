import {AxiosResponse} from "axios";
import {Guardian} from "@/entity";
import {apiClient, request} from "../axiosConfig.ts";
import {GuardianSchema} from "@/schema";

export const changeGuardian = (data: GuardianSchema, student: string) => {
    return apiClient.post<Guardian>(`/student/${student}`, data)
}

export const globalGuardianSearch = (searchInput: string) => {
    return apiClient.get<Guardian>('/guardian/search-all', {
        params: {
            searchInput: searchInput
        }
    })
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

export const getEnrolledStudentsGuardiansByTeacher = (schoolId: string, teacherId: string, page: number, size: number, sortCriteria?: string): Promise<AxiosResponse<Guardian[]>> => {
    return apiClient.get<Guardian[]>(`/enroll/guardians/${schoolId}/${teacherId}`, {
        params: {
            page: page,
            size: size,
            sortCriteria: sortCriteria ? sortCriteria : null
        }
    })
}

export const getSearchedEnrolledStudentGuardianByTeacher = (schoolId: string, teacherId: string, searchInput: string) => {
    return request({
        method: 'GET',
        url: `/enroll/guardians/search/${schoolId}/${teacherId}`,
        params: {
            q: searchInput
        }
    })
}

export const getEnrolledStudentsSelfGuardians = (schoolId: string, guardianId: string, page: number, size: number, sortCriteria?: string): Promise<AxiosResponse<Guardian[]>> => {
    return apiClient.get<Guardian[]>(`/enroll/guardian-self/${schoolId}/${guardianId}`, {
        params: {
            page: page,
            size: size,
            sortCriteria: sortCriteria ? sortCriteria : null
        }
    })
}

export const getSearchedEnrolledStudentSelfGuardian = (schoolId: string, guardianId: string, searchInput: string) => {
    return request({
        method: 'GET',
        url: `/enroll/guardian-self/search/${schoolId}/${guardianId}`,
        params: {
            q: searchInput
        }
    })
}

export const getGuardianById = (guardianId: string): Promise<AxiosResponse<Guardian>> => {
    return apiClient.get<Guardian>(`/guardian/${guardianId}`)
}

export const getGuardianWithStudentsById = (schoolId: string, guardianId: string): Promise<AxiosResponse<Guardian>> => {
    return apiClient.get<Guardian>(`/guardian/withStudent/${schoolId}/${guardianId}`)
}