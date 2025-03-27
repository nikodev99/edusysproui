import {AxiosResponse} from "axios";
import {Classe} from "../../entity";
import {apiClient, request} from "../axiosConfig.ts";
import {ID, Pageable} from "../../core/utils/interfaces.ts";
import {ClasseSchema} from "../../schema";

export const addClasse = (data: ClasseSchema): Promise<AxiosResponse<ClasseSchema>> => {
    return request({
        method: 'POST',
        url: '/classes',
        data: data,
        headers: {'Content-Type': 'application/json'},
    })
}

export const getAllClasses = (page: Pageable, sortCriteria?: string) => {
    return apiClient.get<Classe[]>("/classes", {
        params: {
            page: page.page,
            size: page.size,
            sortCriteria: sortCriteria ? `${sortCriteria},c.createdAt:desc` : 'c.createdAt:desc'
        }
    });
}

export const getAllSearchClasses = (classeName: string): Promise<AxiosResponse<Classe[]>> => {
    return apiClient.get<Classe[]>("/classes/search/", {
        params: {
            q: classeName
        }
    });
}

export const getClasse = (classeId: number, academicYear: string) => {
    return apiClient.get<Classe>(`/classes/${classeId}`, {
        params: {
            academicYear: academicYear
        }
    })
}

export const getClassesBasicValues = (): Promise<AxiosResponse<Classe[]>> => {
    return apiClient.get<Classe[]>("/classes/basic");
}

export const updateClasseValues = (data: ClasseSchema, classeId: ID) => {
    return request({
        method: 'PUT',
        url: `/classes/${classeId}`,
        data: data,
        headers: {'Content-Type': 'application/json'}
    })
}
