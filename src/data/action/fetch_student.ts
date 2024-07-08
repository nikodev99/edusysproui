import {getEnrolledStudents} from "../request";
import {getShortSortOrder} from "../../utils/utils.ts";

export const fetchEnrolledStudent = (page: number, size: number, sortField?: string, sortOrder?: string) => {
    if (sortField && sortOrder) {
        sortOrder = getShortSortOrder(sortOrder)
        sortField = sortedField(sortField)
        return getEnrolledStudents(page, size, `${sortField}:${sortOrder}`);
    }
    return getEnrolledStudents(page, size)
}

const sortedField = (sortField: string) => {
    switch (sortField) {
        case 'lastName':
            return 'e.student.lastName'
        default:
            return undefined;
    }
}