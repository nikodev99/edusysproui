import {AxiosResponse} from "axios";
import {Grade} from "../../entity";
import {apiClient} from "../axiosConfig.ts";

export const getAllSchoolGrades = (schoolId: string): Promise<AxiosResponse<Grade[]>> => {
    return apiClient.get<Grade[]>('/grades/' + schoolId)
}