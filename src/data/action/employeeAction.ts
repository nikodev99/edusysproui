import {loggedUser} from "../../auth/jwt/LoggedUser.ts";
import {getShortSortOrder, setSortFieldName} from "../../core/utils/utils.ts";
import {findAllEmployees, findAllEmployeesSearch} from "../repository/employeeRepository.ts";

const schoolId = loggedUser.getSchool()?.id as string

export const fetchAllEmployees = async (page: number, size: number, sortField?: string, sortOrder?: string) => {
    if (sortField && sortOrder) {
        sortOrder = getShortSortOrder(sortOrder)
        sortField = getSorted(sortField)
        return await findAllEmployees(schoolId, {page: page, size: size}, `${sortField}:${sortOrder}`)
    }
    return await findAllEmployees(schoolId, {page: page, size: size})
}

export const fetchSearchedEmployees = async (query: string) => {
    return await findAllEmployeesSearch(schoolId, query)
}

const getSorted = (sortField: string | string[]) => {
    const field = setSortFieldName(sortField)
    switch (field) {
        case 'lastName':
            return 'e.personalInfo.lastName'
        case 'gender':
            return 'e.personalInfo.gender'
        case 'birthDate':
            return 'e.personalInfo.birthDate'
        case 'status':
            return 'e.personalInfo.status'
        case 'contractType':
            return 'e.contractType'
        default:
            return undefined;
    }
}