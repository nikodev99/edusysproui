import {AxiosResponse} from "axios";
import {Attendance} from "../../entity";
import {request} from "../axiosConfig.ts";
import {Pageable} from "../../utils/interfaces.ts";

export const getStudentAttendances = (studentId: number, pageable: Pageable, academicYearId: string): Promise<AxiosResponse<Attendance[]>> => {
    const {page, size} = pageable
    return request({
        method: 'GET',
        url: `/attendance/${studentId}`,
        params: {
            page: page,
            size: size,
            academicYear: academicYearId
        }
    })
}

export const getAllStudentAttendances = (studentId: number, academicYearId: string): Promise<AxiosResponse<Attendance[]>> => {
    return request({
        method: 'GET',
        url: `/attendance/all/${studentId}`,
        params: {
            academicYear: academicYearId
        }
    })
}

export const getClasseAttendanceStatusCount = (classeId: number, academicYearId: string) => {
    return request({
        method: 'GET',
        url: `/attendance/classe_${classeId}`,
        params: {
            academicYear: academicYearId
        }
    })
}

export const getClasseAttendanceStatus = (classeId: number, academicYearId: string, pageCount?: number, size?: number) => {
    return request({
        method: 'GET',
        url: `/attendance/classe_status/${classeId}`,
        params: {
            academicYear: academicYearId,
            page: pageCount,
            size: size,
        }
    })
}

export const getClasseAttendanceStatusSearch = (classeId: number, academicYearId: string, name: string) => {
    return request({
        method: 'GET',
        url: `/attendance/classe_status_search/${classeId}`,
        params: {
            academicYear: academicYearId,
            search: name
        }
    })
}

export const getClasseRecentAttendanceStatus = (classeId: number, academicYearId: string) => {
    return request({
        method: 'GET',
        url: `/attendance/classe_stat/${classeId}`,
        params: {
            academicYear: academicYearId
        }
    })
}

export const getClasseGoodStudentAttendanceRanking = (classeId: number, academicYearId: string) => {
    return request({
        method: 'GET',
        url: `/attendance/classe_good/${classeId}`,
        params: {
            academicYear: academicYearId
        }
    })
}

export const getClasseWorstStudentAttendanceRanking = (classeId: number, academicYearId: string) => {
    return request({
        method: 'GET',
        url: `/attendance/classe_worst/${classeId}`,
        params: {
            academicYear: academicYearId
        }
    })
}

export const getSchoolAttendanceStatusCount = (schoolId: number, academicYearId: string) => {
    return request({
        method: 'GET',
        url: `/attendance/school_status/${schoolId}`,
        params: {
            academicYear: academicYearId
        }
    })
}