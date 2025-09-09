import {apiClient} from "../axiosConfig.ts";
import {Course} from "../../entity";
import {AxiosResponse} from "axios";
import {ID, Pageable} from "../../core/utils/interfaces.ts";
import {CourseSchema} from "../../schema";

export const addCourse = async (course: CourseSchema): Promise<AxiosResponse<CourseSchema>> => {
    return await apiClient.post("/courses", course, {
        headers: {'Content-Type': 'application/json'},
    });
}

export const getAllCourses = async (schoolId: string, page: Pageable, sortCriteria?: string): Promise<AxiosResponse<Course[]>> => {
    return apiClient.get<Course[]>('/courses/all/' + schoolId, {
        params: {
            page: page.page,
            size: page.size,
            sortCriteria: sortCriteria ? `${sortCriteria},c.createdAt:desc` : 'c.createdAt:desc'
        }
    })
}

export const getAllCoursesSearch = async (schoolId: string, courseName: string): Promise<AxiosResponse<Course[]>> => {
    return apiClient.get<Course[]>('/courses/search/' + schoolId, {
        params: {
            q: courseName
        }
    })
}

export const getAllBasicCourses = (schoolId: string) => {
    return apiClient.get<Course[]>("/courses/basic/" + schoolId)
}

export const getCourseById = (courseId: string): Promise<AxiosResponse<Course>> => {
    return apiClient.get(`/courses/${courseId}`)
}

export const updateCourse = (data: CourseSchema, courseId: ID) => {
    return apiClient.put(`/courses/${courseId}`, data)
}
