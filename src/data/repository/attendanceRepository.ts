import {AxiosResponse} from "axios";
import {Attendance} from "../../entity";
import {apiClient, request} from "../axiosConfig.ts";
import {AttendanceStatusCountResponse, Pageable} from "../../core/utils/interfaces.ts";
import {AttendanceSchema} from "../../schema";

export const insertAttendances = (attendances: AttendanceSchema, classeId: number, date: Date) =>{
    return apiClient.post('attendance', Object.values(attendances?.attendance), {
        params: {
            classe: classeId,
            date: date
        }
    })
}

export const updateAttendances = (attendances: AttendanceSchema) => {
    return apiClient.put('attendance', Object.values(attendances?.attendance))
}

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

export const getAllStudentClasseAttendanceOfTheDay = (classeId: number, academicYearId: string, date?: Date) => {
    return request({
        method: 'GET',
        url: `/attendance/all_classe/${classeId}`,
        params: {
            academicYear: academicYearId,
            dateOfTheDay: date ?? null
        }
    })
}

export const getStudentAttendanceStatusCount = (studentId: number, academicYearId: string): Promise<AxiosResponse<AttendanceStatusCountResponse, unknown>> => {
    return apiClient.get(`/attendance/status_count/${studentId}`, {
        params: {
            academicYear: academicYearId
        }
    })
}

export const getAllSchoolStudentAttendanceOfTheDay = (
    schoolId: string,
    academicYearId: string,
    date?: Date,
    searchable?: string,
    page?: number,
    size?: number,
    sortField?: string,
    sortOrder?: string,
) => {
    console.log('searchable: ', searchable)
    return request({
        method: 'GET',
        url: `/attendance/all_school/${schoolId}`,
        params: {
            page: page,
            size: size,
            academicYear: academicYearId,
            dateOfTheDay: date ?? null,
            search: searchable ?? null,
            sortCriteria: sortField && sortOrder ? `${sortField}:${sortOrder},a.attendanceDate:desc` : 'a.attendanceDate:desc'
        }
    })
}

export const getClasseAttendanceStatusCount = (classeId: number, academicYearId: string, date?: Date): Promise<AxiosResponse<AttendanceStatusCountResponse, unknown>> => {
    return request({
        method: 'GET',
        url: `/attendance/classe_${classeId}`,
        params: {
            academicYear: academicYearId,
            date: date ?? null
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

export const getClasseRecentAttendanceStatus = (classeId: number, academicYearId: string, startDate?: Date, endDate?: Date) => {
    return request({
        method: 'GET',
        url: `/attendance/classe_stat/${classeId}`,
        params: {
            academicYear: academicYearId,
            startDate: startDate ?? null,
            endDate: endDate ?? null
        }
    })
}


export const getSchoolAttendanceStatPerStatus = (schoolId: string, academicYearId: string, startDate?: Date, endDate?: Date) => {
    return request({
        method: 'GET',
        url: `/attendance/school_stat/${schoolId}`,
        params: {
            academicYear: academicYearId,
            startDate: startDate ?? null,
            endDate: endDate ?? null
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

export const getSchoolStudentRanking = (schoolId: string, academicYearId: string, isWorst: boolean = false) => {
    return request({
        method: 'GET',
        url: `/attendance/school_ranking/${schoolId}`,
        params: {
            academicYear: academicYearId,
            isWorst: isWorst ?? false
        }
    })
}

export const getSchoolAttendanceStatusCount = (academicYearId: string, date?: Date): Promise<AxiosResponse<AttendanceStatusCountResponse, unknown>> => {
    return request({
        method: 'GET',
        url: `/attendance/school_status/${academicYearId}`,
        params: {
            date: date ?? null
        }
    })
}