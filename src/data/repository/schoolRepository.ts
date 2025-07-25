import {apiClient} from "../axiosConfig.ts";
import {School} from "../../entity";

export const getSchool = (schoolId: string) => {
    return apiClient.get<School>(`/school/${schoolId}`)
}