import {apiClient} from "../axiosConfig.ts";
import {Course} from "../../entity";
import {AxiosResponse} from "axios";
import {Pageable} from "../../utils/interfaces.ts";
import {CourseSchema} from "../../schema";

export const addCourse = async (course: CourseSchema): Promise<AxiosResponse<CourseSchema>> => {
    return await apiClient.post("/courses", course, {
        headers: {'Content-Type': 'application/json'},
    });
}

export const getAllCourses = async (page: Pageable, sortCriteria?: string): Promise<AxiosResponse<Course[]>> => {
    return apiClient.get<Course[]>('/courses/all', {
        params: {
            page: page.page,
            size: page.size,
            sortCriteria: sortCriteria ? `${sortCriteria},c.createdAt:desc` : 'c.createdAt:desc'
        }
    })
}

export const getAllCoursesSearch = async (courseName: string): Promise<AxiosResponse<Course[]>> => {
    return apiClient.get<Course[]>('/courses/search/', {
        params: {
            q: courseName
        }
    })
}

export const getAllBasicCourses = () => {
    return apiClient.get<Course[]>("/courses")
}
