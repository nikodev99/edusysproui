import {GenderCounted, Pageable} from "../../core/utils/interfaces.ts";
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

export const getEnrolledStudents = (schoolId: string, page: number, size: number, sortCriteria?: string) => {
    return request({
        method: 'GET',
        url: '/enroll/' + schoolId,
        params: {
            page: page,
            size: size,
            sortCriteria: `${sortCriteria ? `${sortCriteria},e.enrollmentDate:desc` : 'e.enrollmentDate:desc'}`
        }
    })
}

export const searchEnrolledStudents = (schoolId: string, searchInput: string) => {
    return request({
        method: 'GET',
        url: '/enroll/search/' + schoolId,
        params: {
            q: searchInput
        }
    })
}

export const getStudentById = (studentId: string): Promise<AxiosResponse<Enrollment>> => {
    return apiClient.get<Enrollment>(`/enroll/student/${studentId}`)
}

export const getClasseEnrolledStudents = (classeId: number, academicYear: string, {page = 0, size = 10}: Pageable, sortCriteria?: string) => {
    return request({
        method: 'GET',
        url: `/enroll/classroom/${classeId}`,
        params: {
            page: page,
            size: size,
            academicYear: academicYear,
            sortCriteria: `${sortCriteria ? `${sortCriteria},e.student.personalInfo.lastName:desc` : 'e.student.personalInfo.lastName:desc'}`
        }
    })
}

export const getClasseEnrolledStudentsSearch = (classeId: number, academicYear: string, searchName?: string) => {
    return request({
        method: 'GET',
        url: `/enroll/classroom_search/${classeId}`,
        params: {
            academicYear: academicYear,
            search: searchName
        }
    })
}

export const getClasseStudents = (classeId: number, academicYear: string) => {
    return request({
        method: 'GET',
        url: `/enroll/classe/${classeId}`,
        params: {
            academicYear: academicYear,
        }
    })
}

export const getRandomStudentClassmate = (schoolId: string, studentId: string, classeId: number): Promise<AxiosResponse<Enrollment[]>> => {
    return apiClient.get<Enrollment[]>(`enroll/classmates/${schoolId}/${studentId}_${classeId}`)
}

export const getAllStudentClassmate = (studentId: string, classeId: number, academicYearId: string, pageable: Pageable) => {
    return request({
        method: 'GET',
        url: `/enroll/classmates/${studentId}_${classeId}`,
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
        case UpdateType.ASSIGNMENT:
            url = '/assignment'
            break
        case UpdateType.EMPLOYEE:
            url = '/employee'
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
    return apiClient.get<GenderCounted>(`/enroll/count_classe/${classeId}`, {
        params: {
            academicYear: academicYearId
        }
    })
}

export const countSomeClasseStudents = (classeId: number[], academicYearId: string) => {
    return request({
        method: 'GET',
        url: `/enroll/count/classe/${classeId?.join(',')}`,
        params: {
            academicYear: academicYearId,
        }
    })
}

export const countStudent = (schoolId: string) => {
    return apiClient.get<GenderCounted>('/enroll/count_school/' + schoolId)
}