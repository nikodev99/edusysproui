import {apiClient, request} from "../axiosConfig.ts";
import {Schedule, Teacher} from "../../entity";
import {Counted} from "../../utils/interfaces.ts";
import {AxiosResponse} from "axios";
import {TeacherSchema} from "../../schema";

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

export const getSearchedTeachers = (input: string) => {
    return apiClient.get<Teacher[]>("/teachers/search/", {params: {q: input}})
}

export const getTeacherById = (teacherId: string): Promise<AxiosResponse<Teacher>> => {
    return apiClient.get<Teacher>(`/teachers/${teacherId}`)
}

export const getNumberOfStudentTaughtByTeacher = (teacherId: string) => {
    return apiClient.get<Counted>(`/teachers/${teacherId}/count_student`)
}

export const getTeacherSchedule = (teacherId: string) => {
    return apiClient.get(`/schedule/teacher/${teacherId}`)
}

export const getTeacherScheduleByDay = (teacherId: string, allDay: boolean): Promise<AxiosResponse<Schedule>> => {
    return apiClient.get(`/schedule/teacher_day/${teacherId}`, {
        params: {
            allDay: allDay
        }
    })
}
