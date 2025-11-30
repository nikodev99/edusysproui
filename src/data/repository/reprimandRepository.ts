import {apiClient} from "../axiosConfig.ts";
import {Pageable} from "../../core/utils/interfaces.ts";

export const getAllStudentReprimands = (studentId: string, academicYearId: string) => {
    return apiClient.get(`/blame/${studentId}`, {
        params: {
            academicYear: academicYearId
        }
    })
}

export const getSomeStudentReprimandedByTeacher = (teacherId: number) => {
    return apiClient.get(`/blame/teacher_some/${teacherId}`)
}

export const getAllStudentReprimandedByTeacher = (teacherId: number, academicYearId: string, pageable?: Pageable) => {
    return apiClient.get(`/blame/teacher_all/${teacherId}`, {
        params: {
            academicYear: academicYearId,
            page: pageable?.page,
            size: pageable?.size
        }
    })
}