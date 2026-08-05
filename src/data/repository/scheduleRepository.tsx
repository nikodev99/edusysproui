import {apiClient} from "../axiosConfig.ts";
import {ScheduleHoursBy} from "@/core/utils/interfaces.ts";
import {ScheduleSchema} from "@/schema";
import {Schedule} from "@/entity";

export const saveSchedule = (schedule: ScheduleSchema) => {
    return apiClient.post<Schedule>(`/schedule`, schedule)
}

export const updateSchedule = (schedule: ScheduleSchema, onlyTime: boolean) => {
    return apiClient.put<Schedule>(`/schedule`, schedule, {
        params: {
            onlyTime: onlyTime
        }
    })
}

export const deleteSchedule = (schedule: Schedule) => {
    return apiClient.delete<number>(`/schedule`, {
        data: schedule
    })
}

export const getAllClasseSchedule = (classeId: number, academicYear: string) => {
    return apiClient.get(`/schedule/classe/${classeId}`, {
        params: {
            academicYear: academicYear
        }
    })
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
