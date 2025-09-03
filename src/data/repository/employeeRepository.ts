import {apiClient} from "../axiosConfig.ts";
import {Pageable} from "../../core/utils/interfaces.ts";
import {Employee} from "../../entity";
import {EmployeeSchema} from "../../schema";

export const insertEmployee = (employee: EmployeeSchema) => {
    return apiClient.post<EmployeeSchema>('/employee', employee)
}

export const findAllEmployees = (schoolId: string, pageable: Pageable, sortCriteria?: string) => {
    return apiClient.get<Employee[]>(`/employee/all/${schoolId}`, {
        params: {
            page: pageable.page,
            size: pageable.size,
            sortCriteria: sortCriteria ? sortCriteria : null
        }
    })
}

export const findAllEmployeesSearch = (schoolId: string, searchInput: string) => {
    return apiClient.get<Employee[]>(`/employee/search/${schoolId}`, {
        params: {
            query: searchInput
        }
    })
}

export const findEmployeeById = (employeeId: string) => {
    return apiClient.get<Employee>(`/employee/${employeeId}`)
}

export const findEmployeeIndividuals = (schoolId: string, searchInput?: string) => {
    return apiClient.get<Employee[]>(`/employee/ind/${schoolId}`, {
        params: {
            q: searchInput
        }
    })
}