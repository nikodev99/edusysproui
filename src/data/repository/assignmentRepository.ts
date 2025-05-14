import {apiClient} from "../axiosConfig.ts";
import {Assignment} from "../../entity";
import {ID, IDS} from "../../core/utils/interfaces.ts";
import {getShortSortOrder} from "../../core/utils/utils.ts";
import {AxiosResponse} from "axios";
import {AssignmentSchema} from "../../schema";

export interface AssignmentFilterProps {
    academicYearId: string
    gradeId?: number
    semesterId?: number
    classeId?: number
    courseId?: number
    search?: string
}

export const insertAssignment = (assignment: AssignmentSchema) => {
    return apiClient.post<AssignmentSchema>('/assignment', assignment)
}

export const getAllAssignments = (
    filter: AssignmentFilterProps,
    page: number,
    size: number,
    sortField?: string,
    sortOrder?: string
) => {
    if (sortField && sortOrder) {
        sortOrder = getShortSortOrder(sortOrder)
        sortField = sortedField(sortField)
    }
    console.log("FIND ALL ASSIGNMENTS PARAMS: ", filter, page, size, sortField, sortOrder)
    return apiClient.get<Assignment[]>(`/assignment/all`, {
        params: {
            academicYear: filter.academicYearId,
            page: page,
            size: size,
            sortCriteria: sortField && sortOrder ? `${sortField}:${sortOrder}` : 'examDate:desc',
            ...(filter.gradeId ? {grade: filter.gradeId} : {}),
            ...(filter.semesterId ? {semester: filter.semesterId} : {}),
            ...(filter.classeId ? {classe: filter.classeId} : {}),
            ...(filter.courseId ? {course: filter.courseId} : {}),
            ...(filter.search ? {search: filter.search} : {})
        }
    })
}

export const getAllNotCompletedAssignment = () => {
    return apiClient.get<Assignment[]>(`/assignment/not_completed`)
}

export const getAllClasseAssignments = (
    {classeId}: {classeId: number, subjectId?: number},
    academicYear: string
) => {
    return apiClient.get<Assignment[]>(`/assignment/classe/${classeId}`, {
        params: {
            academicYear: academicYear
        }
    })
}

export const getAllClasseAssignmentsBySubject = (
    {classeId, subjectId}: {classeId: number, subjectId?: number},
    academicYear: string
) => {
    return apiClient.get<Assignment[]>(`/assignment/classe/${classeId}/${subjectId}`, {
        params: {
            academicYear: academicYear
        }
    })
}

export const getAllCourseAssignments = (courseId: number, academicYear: string) => {
    return apiClient.get<Assignment[]>(`/assignment/course/${courseId}`, {
        params: {
            academicYear: academicYear
        }
    })
}

export const getSomeTeacherAssignments = (personalInfoId: bigint) => {
    return apiClient.get<Assignment[]>(`/assignment/teacher_some_${personalInfoId}`)
}

export const getTeacherAssignments = (personalInfoId: bigint) => {
    return apiClient.get<Assignment[]>(`/assignment/teacher_all/${personalInfoId}`)
}

export const getAllTeacherCourseAssignments = (personalInfoId: bigint, ids: IDS) => {
    return apiClient.get<Assignment[]>(`/assignment/teacher_all_course_${personalInfoId}`, {
        params: {
            classe: ids.classId,
            course: ids.courseId
        }
    })
}

export const getAllTeacherAssignments = (personalInfoId: bigint, ids: IDS) => {
    return apiClient.get<Assignment[]>(`/assignment/teacher_all_${personalInfoId}`, {
        params: {
            classe: ids.classId
        }
    })
}

export const getAssignmentById = (assignmentId: bigint) => {
    return apiClient.get<Assignment>(`/assignment/${assignmentId}`)
}

export const changeAssignmentDate = (assignment: Assignment, assignmentId: ID): Promise<AxiosResponse<{ updated: boolean }>> =>  {
    return apiClient.put<{ updated: boolean }>(`/assignment/change/${assignmentId}`, assignment)
}

export const removeAssignment = (assignmentId: bigint) => {
    return apiClient.delete(`/assignment/${assignmentId}`)
}

const sortedField = (sortField: string) => {
    switch (sortField) {
        case 'examName':
            return 'examName'
        case 'examDate':
            return 'examDate'
        case 'subject':
            return 'subject.course'
        case 'classe':
            return 'classeEntity.name'
    }
}