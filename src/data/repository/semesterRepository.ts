import {apiClient} from "../axiosConfig.ts";
import {Semester} from "../../entity";
import {AllSemesterTemplateSchema, SemesterTemplateSchema} from "../../schema";

export const saveAllSemesters = (semesters: AllSemesterTemplateSchema) => {
    return apiClient.post<AllSemesterTemplateSchema>('/semester/all', semesters.semesters)
}

export const saveSemester = (semester: SemesterTemplateSchema) => {
    return apiClient.post<SemesterTemplateSchema>('/semester', semester)
}

export const getAllSemesters = (schoolId: string) => {
    return apiClient.get<Semester[]>('/semester/all/' + schoolId)
}

export const getAllSemesterByAcademicYear = (academicYearId: string) => {
    return apiClient.get<Semester[]>(`/semester`, {
        params: {
            academicYear: academicYearId
        }
    })
}