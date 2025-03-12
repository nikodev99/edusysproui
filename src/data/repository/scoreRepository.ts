import {AxiosResponse} from "axios";
import {Score} from "../../entity";
import {apiClient, request} from "../axiosConfig.ts";
import {IDS} from "../../utils/interfaces.ts";

export const getAllAssignmentMarks = (assignmentId: string, size: number) => {
    return apiClient.get(`/score/all_assignment_marks/${assignmentId}`, {
        params: {
            size: size
        }
    })
}

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

export const getAllStudentScoresBySubject = (studentId: string, academicYearId: string, subjectId: number): Promise<AxiosResponse<Score[]>> => {
    return request({
        method: 'GET',
        url: `/score/${studentId}/${subjectId}`,
        params: {
            academicYearId: academicYearId,
        }
    })
}

export const getClasseBestStudents = ({classId}: IDS, academicYear: string) => {
    return apiClient.get(`/score/classe_best/${classId}`, {
        params: {
            academicYear: academicYear,
        }
    })
}

export const getClasseBestStudentsByCourse = ({classId, courseId}: IDS, academicYear: string) => {
    return apiClient.get(`/score/classe_best/${classId}/${courseId}`, {
        params: {
            academicYear: academicYear,
        }
    })
}

export const getClassePoorStudents = (classeId: number, academicYear: string) => {
    return apiClient.get(`/score/classe_poor/${classeId}`, {
        params: {
            academicYear: academicYear,
        }
    })
}

export const getAllTeacherMarks = (teacherId: string) => {
    return apiClient.get(`/score/all_teacher_marks/${teacherId}`)
}

export const getBestStudentBySubjectScore = (personalInfoId: number, subjectId: number) => {
    return apiClient.get<Score[]>(`/score/students/${personalInfoId}/${subjectId}`)
}

export const getBestStudentByScore = (personalInfoId: number) => {
    return apiClient.get<Score[]>(`/score/students/${personalInfoId}`)
}
