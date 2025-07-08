import {useFetch, useRawFetch} from "./useFetch.ts";
import {Pageable} from "../core/utils/interfaces.ts";
import {getAllSchoolCourses} from "../data/action/courseAction.ts";
import {UseQueryResult} from "@tanstack/react-query";
import {Course} from "../entity";
import {getAllBasicCourses, getAllCoursesSearch, getCourseById} from "../data/repository/courseRepository.ts";
import {useEffect, useState} from "react";
import {loggedUser} from "../auth/jwt/LoggedUser.ts";

export const useCourseRepo = () => {
    const userSchool = loggedUser.getSchool()

    const useGetAllCourses = (
        pageable: Pageable,
        sortField?: string,
        sortOrder?: string
    ): UseQueryResult<Course[], unknown> => {
        return useFetch(['course-list'], getAllSchoolCourses, [pageable.page, pageable.size, sortField, sortOrder], !!pageable.size);
    }

    const useGetAllCourseSearched = (courseName: string): UseQueryResult<Course[], unknown> => {
        return useFetch(['course-list', courseName], getAllCoursesSearch, [userSchool?.id, courseName], !!userSchool?.id && !!courseName);
    }

    const useGetCourse = (courseId: number): UseQueryResult<Course, unknown> => {
        return useFetch(['course', courseId], getCourseById, [courseId], !!courseId)
    }

    const useGetBasicCourses = (): Course[] => {
        const [courses, setCourses] = useState<Course[]>([])
        const fetch = useRawFetch()

        useEffect(() => {
            fetch(getAllBasicCourses, [userSchool?.id])
                .then(resp => {
                    if (resp) {
                        setCourses(resp.data as Course[])
                    }
                })
        }, [fetch]);

        return courses
    }

    return {
        useGetAllCourses,
        useGetAllCourseSearched,
        useGetCourse,
        useGetBasicCourses
    }
}