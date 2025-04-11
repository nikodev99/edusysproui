import {apiClient} from "../axiosConfig.ts";
import {ScheduleHoursBy} from "../../core/utils/interfaces.ts";

export const getAllClasseSchedule = (classeId: number) => {
    return apiClient.get(`/schedule/classe/${classeId}`)
}

export const getAllCourseSchedule = (courseId: number, byDay: boolean) => {
    return apiClient.get(`/schedule/course/${courseId}`, {
        params: {
            byDay: byDay,
        }
    })
}

export const getCourseHoursByClasse = (courseId: number) => {
    return apiClient.get<ScheduleHoursBy[]>(`/schedule/classe_course_hours/${courseId}`)
}

export const getCourseHoursByTeacher = (courseId: number) => {
    return apiClient.get<ScheduleHoursBy[]>(`/schedule/teacher_course_hours/${courseId}`)
}
