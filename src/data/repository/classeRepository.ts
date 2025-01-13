import {AxiosResponse} from "axios";
import {Classe} from "../../entity";
import {apiClient} from "../axiosConfig.ts";
import {Pageable} from "../../utils/interfaces.ts";

export const getClassesBasicValues = (): Promise<AxiosResponse<Classe[]>> => {
    return apiClient.get<Classe[]>("/classes/basic");
}

export const getAllClasses = (page: Pageable, sortCriteria?: string) => {
    return apiClient.get<Classe[]>("/classes", {
        params: {
            page: page.page,
            size: page.size,
            sortCriteria: sortCriteria
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
