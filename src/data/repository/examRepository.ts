import {AxiosResponse} from "axios";
import {Exam} from "../../entity";
import {request} from "../axiosConfig.ts";

export const getAllExams = (schoolId: string, academicYear: string): Promise<AxiosResponse<Exam[], unknown>> => {
    return request({
        method: 'GET',
        url: `/exam/${schoolId}`,
        params: {
            academicYear: academicYear
        }
    })
}

export const getClasseExams = (classeId: number, academicYear: string): Promise<AxiosResponse<Exam[], unknown>> => {
    return request({
        method: 'GET',
        url: `/exam/classe/${classeId}`,
        params: {
            academicYear: academicYear
        }
    })
}

export const getClasseExamAssignments = (examId: number, classeId: number, academicYear: string): Promise<AxiosResponse<Exam, unknown>> => {
    return request({
        method: 'GET',
        url: `/exam/${examId}/classe_${classeId}`,
        params: {
            academicYear: academicYear
        }
    })
}