import {apiClient, request} from "../axiosConfig.ts";
import {Schedule, Teacher} from "@/entity";
import {Counted, CountType} from "@/core/utils/interfaces.ts";
import {AxiosResponse} from "axios";
import {TeacherSchema} from "@/schema";
import {SectionType} from "@/entity/enums/section.ts";
import {TeacherClassUpdateRequest, TeacherCourseUpdateRequest} from "@/entity/domain/teacher.ts";

export const insertTeacher = async (teacher: TeacherSchema): Promise<AxiosResponse<Teacher>> => {
    return await apiClient.post<Teacher>('/teachers', teacher)
}

export const getAllTeachers = (schoolId: string, page: number, size: number, sortCriteria?: string) => {
    return request({
        method: 'GET',
        url: '/teachers/' + schoolId,
        params: {
            page: page,
            size: size,
            sortCriteria: sortCriteria ? sortCriteria : null,
        }
    })
}

export const getAllSelfTeachers = (schoolId: string, teacherId: string, page: number, size: number, sortCriteria?: string) => {
    return request({
        method: 'GET',
        url: `/teachers/self/${schoolId}/${teacherId}`,
        params: {
            page: page,
            size: size,
            sortCriteria: sortCriteria ? sortCriteria : null,
        }
    })
}

export const getSearchedTeachers = (schoolId: string, input: string): Promise<AxiosResponse<Teacher[], unknown>> => {
    return apiClient.get<Teacher[]>("/teachers/search/" + schoolId, {params: {q: input}})
}

export const getTeachersBasicValues = (classeId: number, section: SectionType): Promise<AxiosResponse<Teacher[], unknown>> => {
    return apiClient.get<Teacher[]>(`/teachers/basic/${classeId}`, {
        params: {
            section: section
        }
    })
}

export const getTeacherBasicValues = (teacherId: number, classeId: number): Promise<AxiosResponse<Teacher>> => {
    return apiClient.get<Teacher>(`/teachers/basic-one/${teacherId}`, {
        params: {
            classe: classeId
        }
    })
}

export const getTeacherById = (teacherId: string, schoolId: string): Promise<AxiosResponse<Teacher>> => {
    return apiClient.get<Teacher>(`/teachers/${teacherId}/${schoolId}`)
}

export const getTeacherClasses = (teacherId: string, schoolId: string) => {
    return apiClient.get<Teacher>(`/teachers/classe/${teacherId}/${schoolId}`)
}

export const getTeacherCourses = (teacherId: string, schoolId: string) => {
    return apiClient.get<Teacher>(`/teachers/course/${teacherId}/${schoolId}`)
}


export const getNumberOfStudentTaughtByTeacher = (teacherId: string, schoolId: string) => {
    return apiClient.get<Counted>(`/teachers/${teacherId}/count_student/${schoolId}`)
}

export const getNumberOfStudentTaughtByClasse = (teacherId: string, schoolId: string) => {
    return apiClient.get<CountType>(`/teachers/count_by_classe/${teacherId}/${schoolId}`)
}

export const getTeacherSchedule = (teacherId: string, academicYear: string): Promise<AxiosResponse<Schedule[]>> => {
    return apiClient.get(`/schedule/teacher/${teacherId}`, {
        params: {
            academicYear: academicYear
        }
    })
}

export const getTeacherWidgets = (teacherId: string, academicYear: string) => {
    return apiClient.get<{
        students: number,
        reports: number,
        reprimands: number
    }>(`/teachers/widgets/${teacherId}`, {
        params: {
            academicYear: academicYear
        }
    })
}

export const updateTeacherClasses = (teacherId: string, schoolId: string, request: TeacherClassUpdateRequest) => {
    return apiClient.patch<string>(`/teachers/classes/${teacherId}/${schoolId}`, request)
}

export const updateTeacherCourses = (teacherId: string, schoolId: string, request: TeacherCourseUpdateRequest) => {
    return apiClient.patch<string>(`/teachers/courses/${teacherId}/${schoolId}`, request)
}

export const getTeacherScheduleByDay = (teacherId: string, academicYear: string, allDay: boolean): Promise<AxiosResponse<Schedule[]>> => {
    return apiClient.get(`/schedule/teacher_day/${teacherId}`, {
        params: {
            academicYear: academicYear,
            allDay: allDay
        }
    })
}

export const countAllTeachers = (schoolId: string) => {
    return apiClient.get(`/teachers/count/${schoolId}`)
}
