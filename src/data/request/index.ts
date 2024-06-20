import {apiClient} from "../axiosConfig.ts";
import {Classe, Guardian} from "../../entity";
import {AxiosResponse} from "axios";

export const getClassesBasicValues = (): Promise<AxiosResponse<Classe[]>> => {
    return apiClient.get<Classe[]>("/classes/basic");
}

export const getEnrolledStudentsGuardians = (): Promise<AxiosResponse<Guardian[]>> => {
    return apiClient.get<Guardian[]>("/enroll/guardians")
}