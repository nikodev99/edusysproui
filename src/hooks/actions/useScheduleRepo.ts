import {useFetch} from "../useFetch.ts";
import {
    deleteSchedule,
    getAllClasseSchedule,
    getAllCourseSchedule,
    getCourseHoursByClasse, getCourseHoursByTeacher, saveSchedule, updateSchedule
} from "../../data/repository/scheduleRepository.tsx";
import {useMutation, UseQueryResult} from "@tanstack/react-query";
import {Schedule} from "@/entity";
import {ScheduleHoursBy} from "@/core/utils/interfaces.ts";
import {ScheduleSchema} from "@/schema";

export const useScheduleRepo = () => {
    const useSaveSchedule = () => useMutation({
        mutationFn: (payload: ScheduleSchema) => saveSchedule(payload)
    })

    const useUpdateSchedule = () => useMutation({
        mutationFn: ({payload, onlyTime = false}: {payload: ScheduleSchema, onlyTime: boolean}) => updateSchedule(payload, onlyTime)
    })

    const useDeleteSchedule = () => useMutation({
        mutationFn: (payload: Schedule) => deleteSchedule(payload)
    })

    const useGetAllClasseSchedule = (classeId: number, academicYear: string): UseQueryResult<Schedule[], unknown> => {
        return useFetch(['classe-schedule', classeId, academicYear], getAllClasseSchedule, [classeId, academicYear], !!classeId && !!academicYear)
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
        useSaveSchedule,
        useUpdateSchedule,
        useDeleteSchedule,
        useGetAllClasseSchedule,
        useGetAllCourseSchedule,
        useGetCourseHourByClasse,
        useGetCourseHourByTeacher
    }
}