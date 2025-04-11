import {useFetch} from "./useFetch.ts";
import {
    getAllClasseSchedule,
    getAllCourseSchedule,
    getCourseHoursByClasse, getCourseHoursByTeacher
} from "../data/repository/scheduleRepository.tsx";
import {UseQueryResult} from "@tanstack/react-query";
import {Schedule} from "../entity";
import {ScheduleHoursBy} from "../core/utils/interfaces.ts";

export const useScheduleRepo = () => {
    const useGetAllClasseSchedule = (classeId: number): UseQueryResult<Schedule[], unknown> => {
        return useFetch(['classe-schedule', classeId], getAllClasseSchedule, [classeId], {
            queryKey: ['classe-schedule', classeId],
            enabled: !!classeId
        })
    }

    const useGetAllCourseSchedule = (courseId: number, byDay: boolean): UseQueryResult<Schedule[], unknown> => {
        return useFetch(['course-schedule', courseId], getAllCourseSchedule, [courseId, byDay], {
            queryKey: ['course-schedule', courseId],
            enabled: !!courseId
        })
    }

    const useGetCourseHourByClasse = (courseId: number): UseQueryResult<ScheduleHoursBy[], unknown> => {
        return useFetch(['course-hour-classe', courseId], getCourseHoursByClasse, [courseId], {
            queryKey: ['course-hour-classe', courseId],
            enabled: !!courseId
        })
    }

    const useGetCourseHourByTeacher = (courseId: number): UseQueryResult<ScheduleHoursBy[], unknown> => {
        return useFetch(['course-hour-teacher', courseId], getCourseHoursByTeacher, [courseId], {
            queryKey: ['course-hour-teacher', courseId],
            enabled: !!courseId
        })
    }

    return {
        useGetAllClasseSchedule,
        useGetAllCourseSchedule,
        useGetCourseHourByClasse,
        useGetCourseHourByTeacher
    }
}