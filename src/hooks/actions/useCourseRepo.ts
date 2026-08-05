import {useFetch, useRawFetch} from "../useFetch.ts";
import {Options, Pageable} from "@/core/utils/interfaces.ts";
import {getAllSchoolCourses} from "@/data/action/courseAction.ts";
import {UseQueryResult} from "@tanstack/react-query";
import {Course} from "@/entity";
import {getAllBasicCourses, getAllCoursesSearch, getCourseById} from "@/data/repository/courseRepository.ts";
import {useEffect, useMemo, useState} from "react";
import {useGlobalStore} from "@/core/global/store.ts";

export const useCourseRepo = () => {
    const schoolId = useGlobalStore(state => state.schoolId)

    const useGetAllCourses = (
        pageable: Pageable,
        sortField?: string,
        sortOrder?: string
    ): UseQueryResult<Course[], unknown> => {
        return useFetch(['course-list'], getAllSchoolCourses, [pageable.page, pageable.size, sortField, sortOrder], !!pageable.size);
    }

    const useGetAllCourseSearched = (courseName: string): UseQueryResult<Course[], unknown> => {
        return useFetch(['course-list', courseName], getAllCoursesSearch, [schoolId, courseName], !!schoolId && !!courseName);
    }

    const useGetCourse = (courseId: number): UseQueryResult<Course, unknown> => {
        return useFetch(['course', courseId], getCourseById, [courseId], !!courseId)
    }

    const useGetBasicCourses = (enabled: boolean = true): Course[] => {
        const [courses, setCourses] = useState<Course[]>([])
        const fetch = useRawFetch()

        useEffect(() => {
            if (enabled)
                fetch(getAllBasicCourses, [schoolId])
                    .then(resp => {
                        if (resp) {
                            setCourses(resp.data as Course[])
                        }
                    })
        }, [enabled, fetch]);

        return courses
    }
    
    const courses = useGetBasicCourses()

    const courseOptions: Options = useMemo(() => courses && courses?.length > 0 ? courses.map(c => ({
        value: c.id,
        label: `${c.course} [${c.abbr}]`
    })): [], [courses])

    return {
        courses,
        courseOptions,
        useGetAllCourses,
        useGetAllCourseSearched,
        useGetCourse,
        useGetBasicCourses
    }
}