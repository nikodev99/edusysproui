import {AxiosResponse} from "axios";
import {AcademicYear} from "../../entity";
import {apiClient} from "../axiosConfig.ts";

export const getAcademicYear = (): Promise<AxiosResponse<AcademicYear>> => {
    return apiClient.get<AcademicYear>('/academic')
}