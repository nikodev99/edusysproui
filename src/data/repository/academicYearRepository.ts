import {AxiosResponse} from "axios";
import {AcademicYear} from "@/entity";
import {apiClient} from "../axiosConfig.ts";
import {AcademicYearSchema} from "@/schema";

export const saveAcademicYear = (academicYear: AcademicYearSchema) => {
    return apiClient.post<AcademicYear>('/academic', academicYear)
}

export const getCurrentAcademicYear = (schoolId: string): Promise<AxiosResponse<AcademicYear>> => {
    return apiClient.get<AcademicYear>('/academic/' + schoolId)
}

export const getAcademicYearFromYear = (schoolId: string, year: number) => {
    return apiClient.get<AcademicYear[]>(`/academic/from/${schoolId}`, {
        params: {
            fromYear: year,
        }
    })
}

export const getAcademicYearFromDate = (schoolId: string, date: Date) => {
    return apiClient.get<AcademicYear>(`/academic/from_date/${schoolId}`, {
        params: {
            fromDate: date,
        }
    })
}

export const getAllAcademicYears = (schoolId: string) => {
    return apiClient.get<AcademicYear[]>('/academic/all/' + schoolId)
}