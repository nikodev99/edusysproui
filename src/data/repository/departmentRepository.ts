import {Department} from "../../entity";
import {apiClient} from "../axiosConfig.ts";

/**
 * TODO add to the setting how to find primary departments if it exists and use this method to find it
 */
export const getPrimaryDepartment = (primary?: string) => {
    return apiClient.get<Department>(`/department`, {
        params: {
            departmentCode: primary
        }
    })
}