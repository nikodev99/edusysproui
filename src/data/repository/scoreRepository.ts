import {AxiosResponse} from "axios";
import {Score} from "../../entity";
import {apiClient, request} from "../axiosConfig.ts";

export const getAllStudentScores = (page: number, size: number, studentId: string, academicYearId: string): Promise<AxiosResponse<Score[]>> => {
    return request({
        method: 'GET',
        url: `/score/all/${studentId}`,
        params: {
            page: page,
            size: size,
            academicYearId: academicYearId
        }
    })
}

export const getAllStudentScoresBySubject = (academicYearId: string, subjectId: number): Promise<AxiosResponse<Score[]>> => {
    return request({
        method: 'GET',
        url: `/score/all/${subjectId}`,
        params: {
            academicYearId: academicYearId,
        }
    })
}

export const getAllTeacherMarks = (teacherId: string) => {
    return apiClient.get(`/score/all_teacher_marks/${teacherId}`)
}