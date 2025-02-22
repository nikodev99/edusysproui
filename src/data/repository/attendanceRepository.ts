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

export const getClasseAttendanceStatusCount = (classeId: number, academicYearId: string): Promise<AxiosResponse<Attendance[]>> => {
    return request({
        method: 'GET',
        url: `/attendance/classe_${classeId}`,
        params: {
            academicYear: academicYearId
        }
    })
}