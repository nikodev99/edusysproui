import {apiClient} from "../axiosConfig.ts";
import {Semester} from "../../entity";

export const getAllSemesters = () => {
    return apiClient.get<Semester[]>('/semester')
}