import {apiClient, request} from "../axiosConfig.ts";
import {Teacher} from "../../entity";

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