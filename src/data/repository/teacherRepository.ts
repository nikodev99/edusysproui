import {apiClient, request} from "../axiosConfig.ts";
import {Teacher} from "../../entity";
import {TeacherSchema} from "../../utils/interfaces.ts";
import {AxiosResponse} from "axios";

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
