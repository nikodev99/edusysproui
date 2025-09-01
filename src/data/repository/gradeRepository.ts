import {AxiosResponse} from "axios";
import {Grade} from "../../entity";
import {apiClient} from "../axiosConfig.ts";
import {GradeSchema} from "../../schema";

export const saveGrade = async (grade: GradeSchema) => {
    return await apiClient.post<GradeSchema>('/grades', grade)
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

export const getGradeById = (gradeId: number) => {
    return apiClient.get<Grade>('/grades', {
        params: {
            gradeId: gradeId,
        }
    })
}