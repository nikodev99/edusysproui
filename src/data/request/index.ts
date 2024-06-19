import {apiClient} from "../axiosConfig.ts";
import {Classe} from "../../entity";
import {AxiosResponse} from "axios";

export const getClassesBasicValues = (): Promise<AxiosResponse<Classe[]>> => {
    return apiClient.get<Classe[]>("/classes/basic");
}

