import {EnrollmentSchema} from "../../utils/interfaces.ts";
import {AxiosResponse} from "axios";
import {Enrollment} from "../../entity";
import {apiClient, request} from "../axiosConfig.ts";

export const enrollStudent = (data: EnrollmentSchema): Promise<AxiosResponse<Enrollment>> => {
    return request({
        method: 'POST',
        url: '/enroll',
        data: data,
        headers: {'Content-Type': 'application/json'},
    })
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

export const getStudentById = (studentId: string): Promise<AxiosResponse<Enrollment>> => {
    return apiClient.get(`/enroll/student/${studentId}`)
}

export const getRandomStudentClassmate = (studentId: string) => {
    return apiClient.get(`/enroll/student/${studentId}/classmate`)
}