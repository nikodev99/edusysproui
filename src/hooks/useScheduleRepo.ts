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
        return useFetch(['classe-schedule', classeId], getAllClasseSchedule, [classeId], !!classeId)
    }

    const useGetAllCourseSchedule = (courseId: number, byDay: boolean): UseQueryResult<Schedule[], unknown> => {
        return useFetch(['course-schedule', courseId], getAllCourseSchedule, [courseId, byDay], !!courseId)
    }

    const useGetCourseHourByClasse = (courseId: number): UseQueryResult<ScheduleHoursBy[], unknown> => {
        return useFetch(['course-hour-classe', courseId], getCourseHoursByClasse, [courseId], !!courseId)
    }

    const useGetCourseHourByTeacher = (courseId: number): UseQueryResult<ScheduleHoursBy[], unknown> => {
        return useFetch(['course-hour-teacher', courseId], getCourseHoursByTeacher, [courseId], !!courseId)
    }

    return {
        useGetAllClasseSchedule,
        useGetAllCourseSchedule,
        useGetCourseHourByClasse,
        useGetCourseHourByTeacher
    }
}