import {AxiosResponse} from "axios";
import {Classe, ClasseStudentBoss, ClasseTeacherBoss} from "@/entity";
import {apiClient, request} from "../axiosConfig.ts";
import {ID, Pageable} from "@/core/utils/interfaces.ts";
import {ClasseSchema, StudentBossSchema, TeacherBossSchema} from "@/schema";

export const addClasse = (data: ClasseSchema): Promise<AxiosResponse<ClasseSchema>> => {
    return request({
        method: 'POST',
        url: '/classes',
        data: data,
        headers: {'Content-Type': 'application/json'},
    })
}

export const getAllClasses = (schoolId: string, page: Pageable, sortCriteria?: string) => {
    return apiClient.get<Classe[]>("/classes/all/" + schoolId, {
        params: {
            page: page.page,
            size: page.size,
            sortCriteria: sortCriteria ? `${sortCriteria},c.createdAt:desc` : 'c.createdAt:desc'
        }
    });
}

export const getAllClassesByTeacher = (schoolId: string, teacherId: string, page: Pageable, sortCriteria?: string) => {
    return apiClient.get<Classe[]>(`/classes/all/${schoolId}/${teacherId}`, {
        params: {
            page: page.page,
            size: page.size,
            sortCriteria: sortCriteria ? `${sortCriteria},c.createdAt:desc` : 'c.createdAt:desc'
        }
    });
}

export const getAllSearchClasses = (schoolId: string, classeName: string): Promise<AxiosResponse<Classe[]>> => {
    return apiClient.get<Classe[]>("/classes/search/" + schoolId, {
        params: {
            q: classeName
        }
    });
}

export const getAllSearchClassesByTeacher = (schoolId: string, teacherId: string, classeName: string): Promise<AxiosResponse<Classe[]>> => {
    return apiClient.get<Classe[]>(`/classes/search/${schoolId}/${teacherId}`, {
        params: {
            q: classeName
        }
    });
}

export const getClasse = (classeId: number, academicYear: string, isBasic: boolean = false) => {
    return apiClient.get<Classe>(`/classes/${classeId}`, {
        params: {
            academicYear: academicYear,
            basic: isBasic
        }
    })
}

export const getClassesBasicValues = (schoolId: string): Promise<AxiosResponse<Classe[]>> => {
    return apiClient.get<Classe[]>("/classes/basic/" + schoolId);
}

export const updateClasseValues = (data: ClasseSchema, classeId: ID) => {
    return request({
        method: 'PUT',
        url: `/classes/${classeId}`,
        data: data,
        headers: {'Content-Type': 'application/json'}
    })
}

export const saveStudentBoss = async (data: StudentBossSchema) => {
    return await apiClient.post<ClasseStudentBoss>("/classes/student_boss", data)
}

export const saveTeacherBoss = async (data: TeacherBossSchema) => {
    return await apiClient.post<ClasseTeacherBoss>("/classes/teacher_boss", data)
}

export const updatePrincipalCourse = async (classeId: number, courseId: number) => {
    return await apiClient.patch<number>("/classes/" + classeId, {field: 'principalCourse', value: courseId as number})
}
