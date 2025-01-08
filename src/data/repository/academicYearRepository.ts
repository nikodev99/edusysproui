import {AxiosResponse} from "axios";
import {AcademicYear} from "../../entity";
import {apiClient} from "../axiosConfig.ts";

export const getCurrentAcademicYear = (): Promise<AxiosResponse<AcademicYear>> => {
    return apiClient.get<AcademicYear>('/academic')
}