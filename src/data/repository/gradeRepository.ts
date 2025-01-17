import {AxiosResponse} from "axios";
import {Grade} from "../../entity";
import {apiClient} from "../axiosConfig.ts";

export const getAllSchoolGrades = (): Promise<AxiosResponse<Grade[]>> => {
    return apiClient.get<Grade[]>('/grades')
}