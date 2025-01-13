import {apiClient} from "../axiosConfig.ts";
import {Course} from "../../entity";
import {AxiosResponse} from "axios";
import {Pageable} from "../../utils/interfaces.ts";

export const getAllCourses = async (page: Pageable, sortCriteria?: string): Promise<AxiosResponse<Course[]>> => {
    return apiClient.get<Course[]>('/courses/all', {
        params: {
            page: page.page,
            size: page.size,
            sortCriteria: sortCriteria ? sortCriteria : null
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
