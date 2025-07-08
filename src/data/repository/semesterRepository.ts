import {apiClient} from "../axiosConfig.ts";
import {Semester} from "../../entity";

export const getAllSemesters = (schoolId: string) => {
    return apiClient.get<Semester[]>('/semester/' + schoolId)
}