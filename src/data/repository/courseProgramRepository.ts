import {request} from "../axiosConfig.ts";
import {IDS} from "@/core/utils/interfaces.ts";
import {AxiosResponse} from "axios";
import {CourseProgramResponse} from "@/entity/domain/courseProgram.ts";

export const getAllTeacherCourseProgram = (
    teacherId: string,
    ids: IDS,
    academicYear: string
): Promise<AxiosResponse<CourseProgramResponse, unknown>> => {
    return request({
        method: 'GET',
        url: `/programs/course/${teacherId}`,
        params: {
            classe: ids.classId,
            course: ids.courseId,
            academicYear: academicYear
        }
    })
}

export const getAllTeacherProgram = (
    teacherId: string,
    ids: IDS,
    academicYear: string
): Promise<AxiosResponse<CourseProgramResponse, unknown>> => {
    return request({
        method: 'GET',
        url: `/programs/${teacherId}`,
        params: {
            classe: ids.classId,
            academicYear: academicYear
        }
    })
}