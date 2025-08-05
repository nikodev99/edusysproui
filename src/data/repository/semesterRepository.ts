import {apiClient} from "../axiosConfig.ts";
import {Semester} from "../../entity";
import {AllSemesterSchema, SemesterSchema} from "../../schema";

export const saveAllSemesters = (semesters: AllSemesterSchema) => {
    return apiClient.post<AllSemesterSchema>('/semester/all', semesters.semesters)
}

export const saveSemester = (semester: SemesterSchema) => {
    return apiClient.post<SemesterSchema>('/semester', semester)
}

export const getAllSemesters = (schoolId: string) => {
    return apiClient.get<Semester[]>('/semester/' + schoolId)
}

export const getAllSemesterByAcademicYear = (academicYearId: string) => {
    return apiClient.get<Semester[]>(`/semester`, {
        params: {
            academicYear: academicYearId
        }
    })
}