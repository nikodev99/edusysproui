import {apiClient} from "../axiosConfig.ts";
import {Assignment} from "../../entity/domain/assignment.ts";
import {IDS} from "../../utils/interfaces.ts";

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