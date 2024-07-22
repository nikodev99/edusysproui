import {apiClient, request} from "../axiosConfig.ts";
import {AcademicYear, Classe, Guardian, Student} from "../../entity";
import {AxiosResponse} from "axios";

export const getAcademicYear = (): Promise<AxiosResponse<AcademicYear>> => {
    return apiClient.get<AcademicYear>('/academic')
}

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
    return request({
        method: 'GET',
        url: '/enroll',
        params: {
            page: page,
            size: size,
            sortCriteria: `${sortCriteria ? `${sortCriteria},e.enrollmentDate:desc` : 'e.enrollmentDate:desc'}`
        }
    })
}

export const searchEnrolledStudents = (searchInput: string) => {
    return request({
        method: 'GET',
        url: '/enroll/search/',
        params: {
            q: searchInput
        }
    })
}

export const getStudentById = (studentId: string): Promise<AxiosResponse<Student>> => {
    return apiClient.get(`/student/${studentId}`)
}