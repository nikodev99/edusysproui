import {useFetch, useRawFetch} from "../useFetch.ts";
import {Options, Pageable} from "@/core/utils/interfaces.ts";
import {UseQueryResult} from "@tanstack/react-query";
import {Course} from "@/entity";
import {
    getAllBasicCourses,
    getAllCourses,
    getTeacherCourses,
    getAllCoursesSearch,
    getCourseById
} from "@/data/repository/courseRepository.ts";
import {useEffect, useMemo, useState} from "react";
import {useGlobalStore} from "@/core/global/store.ts";
import {useAuth} from "@/hooks/useAuth.ts";
import {getShortSortOrder, setSortFieldName} from "@/core/utils/utils.ts";
import {UserPermission} from "@/core/shared/sharedEnums.ts";

export const useCourseRepo = (context: UserPermission = UserPermission.ALL) => {
    const schoolId = useGlobalStore(state => state.schoolId)

    const useGetPaginated = () => {
        const {user} = useAuth()

        return {
            getPaginatedCourses: async (page: number, size: number, sortField?: string, sortOrder?: string) => {
                if(sortField && sortOrder) {
                    sortOrder = getShortSortOrder(sortOrder)
                    sortField = sortedField(sortField);

                    switch (context) {
                        case UserPermission.ALL:
                            return await getAllCourses(schoolId, {page: page, size: size}, `${sortField}:${sortOrder}`);
                        case UserPermission.TEACHER:
                            return await getTeacherCourses(schoolId, user?.userId as string)
                    }
                }
                switch (context) {
                    case UserPermission.ALL:
                        return await getAllCourses(schoolId, {page: page, size: size})
                    case UserPermission.TEACHER:
                        return await getTeacherCourses(schoolId, user?.userId as string)
                }

            },
            getSearchedCourses: async (searchInput: string) => {
                switch (context) {
                    case UserPermission.ALL:
                        return await getAllCoursesSearch(schoolId, searchInput)
                    default:
                        return () => []
                }
            }
        }
    }

    const useGetAllCourses = (
        pageable: Pageable,
        sortField?: string,
        sortOrder?: string
    ): UseQueryResult<Course[], unknown> => {
        return useFetch(['course-list'], getAllCourses, [schoolId, pageable, `${sortField}:${sortOrder}`], !!pageable.size);
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
    const countCourses = courses?.length ?? 0

    const courseOptions: Options = useMemo(() => courses && courses?.length > 0 ? courses.map(c => ({
        value: c.id,
        label: `${c.course} [${c.abbr}]`
    })): [], [courses])

    return {
        courses,
        countCourses,
        courseOptions,
        useGetPaginated,
        useGetAllCourses,
        useGetAllCourseSearched,
        useGetCourse,
        useGetBasicCourses
    }
}

const sortedField = (sortField: string | string[]) => {
    switch (setSortFieldName(sortField)) {
        case 'course':
            return 'c.course'
        case 'abbr':
            return 'c.abbr'
        case 'name':
            return 'c.department.name'
        case 'courseType':
            return 'c.courseType'
        case 'createdAt':
            return 'c.createdAt'
        default:
            return undefined;
    }
}