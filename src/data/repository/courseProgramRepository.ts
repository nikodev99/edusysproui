import {request} from "../axiosConfig.ts";
import {IDS} from "../../core/utils/interfaces.ts";

export const getAllTeacherCourseProgram = (teacherId: string, ids: IDS) => {
    return request({
        method: 'GET',
        url: `/programs/course/${teacherId}`,
        params: {
            classe: ids.classId,
            course: ids.courseId
        }
    })
}

export const getAllTeacherProgram = (teacherId: string, ids: IDS) => {
    return request({
        method: 'GET',
        url: `/programs/${teacherId}`,
        params: {
            classe: ids.classId
        }
    })
}