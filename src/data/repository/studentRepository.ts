import {Counted, GenderCounted, Pageable} from "../../utils/interfaces.ts";
import {AxiosResponse} from "axios";
import {Enrollment} from "../../entity";
import {apiClient, request} from "../axiosConfig.ts";
import {EnrollmentSchema} from "../../schema";
import {UpdateType} from "../../core/shared/sharedEnums.ts";

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
    return apiClient.get<Enrollment>(`/enroll/student/${studentId}`)
}

export const getRandomStudentClassmate = (studentId: string, classeId: number): Promise<AxiosResponse<Enrollment[]>> => {
    return apiClient.get<Enrollment[]>(`enroll/classmates/${studentId}_${classeId}`)
}

export const getAllStudentClassmate = (studentId: string, classeId: number, academicYearId: string, pageable: Pageable) => {
    return request({
        method: 'GET',
        url: `/enroll/${studentId}_${classeId}`,
        params: {
            academicYearId: academicYearId,
            page: pageable.page,
            size: pageable.size,
        }
    })
}

export const updateStudentByField = <T>(field: keyof T, value: unknown, studentId: string | number | bigint, type?: UpdateType) => {
    let url: string
    switch (type) {
        case UpdateType.ADDRESS:
            url = '/student/address'
            break
        case UpdateType.HEALTH:
            url = '/student/health'
            break
        case UpdateType.GUARDIAN:
            url = '/student/guardian'
            break
        case UpdateType.INFO:
            url = '/student/info'
            break
        case UpdateType.TEACHER:
            url = '/teachers'
            break
        default:
            url = '/student'
            break
    }
    return request({
        method: 'PATCH',
        url: `${url}/${studentId}`,
        data: {
            field: field,
            value: value,
        }
    })
}

export const countClasseStudents = (classeId: number, academicYearId: string) => {
    return apiClient.get<GenderCounted[]>(`/enroll/count/${classeId}`, {
        params: {
            academicYear: academicYearId
        }
    })
}

export const countStudent = () => {
    return apiClient.get<Counted>('/enroll/count')
}