import {apiClient, request} from "../axiosConfig.ts";
import {Schedule, Teacher} from "../../entity";
import {Counted, CountType} from "../../core/utils/interfaces.ts";
import {AxiosResponse} from "axios";
import {TeacherSchema} from "../../schema";
import {SectionType} from "../../entity/enums/section.ts";

export const insertTeacher = async (teacher: TeacherSchema): Promise<AxiosResponse<Teacher>> => {
    return await apiClient.post<Teacher>('/teachers', teacher)
}

export const getAllTeachers = (page: number, size: number, sortCriteria?: string) => {
    return request({
        method: 'GET',
        url: '/teachers',
        params: {
            page: page,
            size: size,
            sortCriteria: sortCriteria ? sortCriteria : null,
        }
    })
}

export const getSearchedTeachers = (input: string): Promise<AxiosResponse<Teacher[], unknown>> => {
    return apiClient.get<Teacher[]>("/teachers/search/", {params: {q: input}})
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

export const getTeacherById = (teacherId: string): Promise<AxiosResponse<Teacher>> => {
    return apiClient.get<Teacher>(`/teachers/${teacherId}`)
}

export const getNumberOfStudentTaughtByTeacher = (teacherId: string) => {
    return apiClient.get<Counted>(`/teachers/${teacherId}/count_student`)
}

export const getNumberOfStudentTaughtByClasse = (teacherId: string) => {
    return apiClient.get<CountType>(`/teachers/count_by_classe/${teacherId}`)
}

export const getTeacherSchedule = (teacherId: string): Promise<AxiosResponse<Schedule[]>> => {
    return apiClient.get(`/schedule/teacher/${teacherId}`)
}

export const getTeacherScheduleByDay = (teacherId: string, allDay: boolean): Promise<AxiosResponse<Schedule[]>> => {
    return apiClient.get(`/schedule/teacher_day/${teacherId}`, {
        params: {
            allDay: allDay
        }
    })
}

export const countAllTeachers = () => {
    return apiClient.get(`/teachers/count`)
}
