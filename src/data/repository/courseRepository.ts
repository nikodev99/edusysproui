import {apiClient} from "../axiosConfig.ts";

export const getAllCourses = () => {
    return apiClient.get("/courses");
}