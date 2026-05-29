import {request} from "../axiosConfig.ts";
import {IDS, MessageResponse} from "@/core/utils/interfaces.ts";
import {AxiosResponse} from "axios";
import {CourseProgramResponse, ProgramStatus} from "@/entity/domain/courseProgram.ts";
import {TeacherCourseProgram, TeacherProgramTopic} from "@/schema";

export const addProgram = (data: TeacherCourseProgram): Promise<AxiosResponse<MessageResponse, unknown>> => {
    return request({
        method: 'POST',
        url: '/programs',
        data: data,
        headers: {'Content-Type': 'application/json'},
    })
}


export const addProgramTopic = (data: TeacherProgramTopic): Promise<AxiosResponse<MessageResponse, unknown>> => {
    return request({
        method: 'POST',
        url: '/programs/topic',
        data: data,
        headers: {'Content-Type': 'application/json'},
    })
}

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

export const changeStatus = (timingId: number, status: keyof typeof ProgramStatus): Promise<AxiosResponse<MessageResponse, unknown>> => {
    return request({
        method: 'PATCH',
        url: `/programs/${timingId}`,
        params: {
            status: status
        }
    })
}

export const completed = (timingId: number): Promise<AxiosResponse<MessageResponse, unknown>> => {
    return request({
        method: 'PATCH',
        url: `/programs/complete/${timingId}`,
    })
}

export const deleteProgram = (programId: number): Promise<AxiosResponse<MessageResponse, unknown>> => {
    return request({
        method: 'DELETE',
        url: `/programs/${programId}`,
    })
}

export const deleteTopic = (topicId: number): Promise<AxiosResponse<MessageResponse, unknown>> => {
    return request({
        method: 'DELETE',
        url: `/programs/topic/${topicId}`,
    })
}
