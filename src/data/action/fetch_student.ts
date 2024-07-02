import {getEnrolledStudents} from "../request";

export const fetchEnrolledStudent = (page: number, size: number) => {
    return getEnrolledStudents(page, size)
}