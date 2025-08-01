import {AxiosResponse} from "axios";
import {Grade} from "../../entity";
import {apiClient} from "../axiosConfig.ts";

export const saveGrade = (grade: Grade) => {
    return apiClient.post<Grade>('/grades', grade)
}

export const getAllSchoolGrades = (schoolId: string): Promise<AxiosResponse<Grade[]>> => {
    return apiClient.get<Grade[]>('/grades/' + schoolId)
}

export const getGradesWithPlanning = (schoolId: string, academicYearId: string) => {
    return apiClient.get<Grade[]>(`/grades/all/${schoolId}`, {
        params: {
            academicYear: academicYearId
        }
    })
}