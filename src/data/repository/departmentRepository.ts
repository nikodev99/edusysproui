import {Department} from "../../entity";
import {apiClient} from "../axiosConfig.ts";

export const saveDepartment = (department: Department) => {
    return apiClient.post<Department>('/department', department)
}

/**
 * TODO add to the setting how to find primary departments if it exists and use this method to find it
 */
export const getDepartmentBasics = (schoolId: string) => {
    return apiClient.get<Department[]>(`/department/basics/${schoolId}`)
}

export const getPrimaryDepartment = (schoolId: string, primary?: string) => {
    return apiClient.get<Department>(`/department/${schoolId}`, {
        params: {
            departmentCode: primary
        }
    })
}