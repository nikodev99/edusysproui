import {AxiosResponse} from "axios";
import {Score} from "../../entity";
import {apiClient, request} from "../axiosConfig.ts";
import {IDS} from "../../core/utils/interfaces.ts";

export const getAllAssignmentMarks = (assignmentId: bigint, size: number) => {
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

export const getCourseBestStudentsByCourse = (courseId: number, academicYear: string) => {
    return apiClient.get(`/score/course_best/${courseId}`, {
        params: {
            academicYear: academicYear,
        }
    })
}

export const getCoursePoorStudents = (courseId: number, academicYear: string) => {
    return apiClient.get(`/score/course_poor/${courseId}`, {
        params: {
            academicYear: academicYear,
        }
    })
}

export const getAllTeacherMarks = (teacherId: bigint | bigint[]) => {
    const requestParam: string = Array.isArray(teacherId) ? teacherId?.join(',') : `${teacherId}`
    return apiClient.get(`/score/all_teacher_marks/${requestParam}`)
}

export const getBestTeacherStudentBySubject = (teacherId: bigint, subjectId: number) => {
    return apiClient.get<Score[]>(`/score/students/${teacherId}/${subjectId}`)
}

export const getBestTeacherStudentByScore = (personalInfoId: bigint) => {
    return apiClient.get<Score[]>(`/score/students/${personalInfoId}`)
}
