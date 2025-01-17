import {AxiosResponse} from "axios";
import {Classe} from "../../entity";
import {apiClient, request} from "../axiosConfig.ts";
import {Pageable} from "../../utils/interfaces.ts";
import {ClasseSchema} from "../../schema";

export const addClasse = (data: ClasseSchema): Promise<AxiosResponse<ClasseSchema>> => {
    return request({
        method: 'POST',
        url: '/classes',
        data: data,
        headers: {'Content-Type': 'application/json'},
    })
}

export const getClassesBasicValues = (): Promise<AxiosResponse<Classe[]>> => {
    return apiClient.get<Classe[]>("/classes/basic");
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
