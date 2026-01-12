import {AxiosResponse} from "axios";
import {Exam} from "@/entity";
import {request} from "../axiosConfig.ts";
import {ExamProgress, ExamResponse} from "@/entity/domain/exam.ts";

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

export const getClasseExamAssignments = (examId: number, classeId: number, academicYear: string): Promise<AxiosResponse<ExamResponse, unknown>> => {
    return request({
        method: 'GET',
        url: `/exam/${examId}/classe_${classeId}`,
        params: {
            academicYear: academicYear
        }
    })
}

export const getStudentExamAssignments = (examId: number, classeId: number, academicYear: string, studentId: string): Promise<AxiosResponse<ExamResponse, unknown>> => {
    return request({
        method: 'GET',
        url: `/exam/${examId}/${studentId}/${classeId}`,
        params: {
            academicYear: academicYear
        }
    })
}

export const getStudentExamProgress = (studentId: string, classeId: number, academicYear: string): Promise<AxiosResponse<ExamProgress[], unknown>> => {
    return request({
        method: 'GET',
        url: `/exam/progress/${studentId}/${classeId}`,
        params: {
            academicYear: academicYear
        }
    })
}