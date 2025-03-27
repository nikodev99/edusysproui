import {apiClient} from "../axiosConfig.ts";
import {Assignment} from "../../entity/domain/assignment.ts";
import {ID, IDS} from "../../core/utils/interfaces.ts";

export const getAllClasseAssignments = (
    {classeId}: {classeId: number, subjectId?: number},
    academicYear: string
) => {
    return apiClient.get(`/assignment/classe/${classeId}`, {
        params: {
            academicYear: academicYear
        }
    })
}

export const getAllClasseAssignmentsBySubject = (
    {classeId, subjectId}: {classeId: number, subjectId?: number},
    academicYear: string
) => {
    return apiClient.get(`/assignment/classe/${classeId}/${subjectId}`, {
        params: {
            academicYear: academicYear
        }
    })
}

export const getSomeTeacherAssignments = (personalInfoId: number) => {
    return apiClient.get<Assignment[]>(`/assignment/teacher_some_${personalInfoId}`)
}

export const getTeacherAssignments = (personalInfoId: number) => {
    return apiClient.get<Assignment[]>(`/assignment/teacher_all/${personalInfoId}`)
}

export const getAllTeacherCourseAssignments = (personalInfoId: number, ids: IDS) => {
    return apiClient.get<Assignment[]>(`/assignment/teacher_all_course_${personalInfoId}`, {
        params: {
            classe: ids.classId,
            course: ids.courseId
        }
    })
}

export const getAllTeacherAssignments = (personalInfoId: number, ids: IDS) => {
    return apiClient.get<Assignment[]>(`/assignment/teacher_all_${personalInfoId}`, {
        params: {
            classe: ids.classId
        }
    })
}

export const changeAssignmentDate = (assignment: Assignment, assignmentId: ID)=>  {
    return apiClient.put<Assignment>(`/assignment/change/${assignmentId}`, assignment)
}

export const removeAssignment = (assignmentId: bigint) => {
    return apiClient.delete(`/assignment/${assignmentId}`)
}