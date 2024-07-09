import {getEnrolledStudents, searchEnrolledStudents} from "../request";
import {getShortSortOrder} from "../../utils/utils.ts";
import {ErrorCatch} from "./error_catch.ts";

export const fetchEnrolledStudents = (page: number, size: number, sortField?: string, sortOrder?: string) => {
    if (sortField && sortOrder) {
        sortOrder = getShortSortOrder(sortOrder)
        sortField = sortedField(sortField)
        return getEnrolledStudents(page, size, `${sortField}:${sortOrder}`)
    }
    return getEnrolledStudents(page, size)
}

export const fetchSearchedEnrolledStudents = async (searchInput: string) => {
    try {
        const resp = await searchEnrolledStudents(searchInput)
        if (resp && 'data' in resp) {
            return {
                isSuccess: true,
                data: resp.data
            }
        }else {
            return {
                isSuccess: false
            }
        }
    }catch (err: unknown) {
        ErrorCatch(err)
    }
}

const sortedField = (sortField: string) => {
    switch (sortField) {
        case 'lastName':
            return 'e.student.lastName'
        default:
            return undefined;
    }
}