import {AxiosResponse} from "axios";
import {Classe} from "../../entity";
import {apiClient} from "../axiosConfig.ts";

export const getClassesBasicValues = (): Promise<AxiosResponse<Classe[]>> => {
    return apiClient.get<Classe[]>("/classes/basic");
}