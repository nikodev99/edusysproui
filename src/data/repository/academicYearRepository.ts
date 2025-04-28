import {AxiosResponse} from "axios";
import {AcademicYear} from "../../entity";
import {apiClient} from "../axiosConfig.ts";

export const getCurrentAcademicYear = (): Promise<AxiosResponse<AcademicYear>> => {
    return apiClient.get<AcademicYear>('/academic')
}

export const getAcademicYearFromYear = (year: number) => {
    return apiClient.get<AcademicYear[]>(`/academic/from`, {
        params: {
            fromYear: year,
        }
    })
}

export const getAllAcademicYears = () => {
    return apiClient.get<AcademicYear[]>('/academic/all')
}