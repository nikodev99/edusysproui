import {useFetch, useRawFetch} from "./useFetch.ts";
import {Pageable} from "../core/utils/interfaces.ts";
import {getAllSchoolCourses} from "../data/action/courseAction.ts";
import {UseQueryResult} from "@tanstack/react-query";
import {Course} from "../entity";
import {getAllBasicCourses, getAllCoursesSearch, getCourseById} from "../data/repository/courseRepository.ts";
import {Response} from "../data/action/response.ts";

export const useCourseRepo = () => {
    const useGetAllCourses = (
        pageable: Pageable,
        sortField?: string,
        sortOrder?: string
    ): UseQueryResult<Course[], unknown> => {
        return useFetch(['course-list'], getAllSchoolCourses, [pageable.page, pageable.size, sortField, sortOrder], {
            queryKey: ['course-list'],
            enabled: !!pageable.size
        });
    }

    const useGetAllCourseSearched = (courseName: string): UseQueryResult<Course[], unknown> => {
        return useFetch(['course-list', courseName], getAllCoursesSearch, [courseName], {
            queryKey: ['course-list', courseName],
            enabled: !!courseName
        });
    }

    const useGetCourse = (courseId: number): UseQueryResult<Course, unknown> => {
        return useFetch(['course', courseId], getCourseById, [courseId], {
            queryKey: ['course', courseId],
            enabled: !!courseId
        })
    }

    const useGetBasicCourses = (): Promise<Response<Course>> => {
        const fetch = useRawFetch()
        return fetch(getAllBasicCourses, [])
    }

    return {
        useGetAllCourses,
        useGetAllCourseSearched,
        useGetCourse,
        useGetBasicCourses
    }
}