import {
    countStudent,
    getEnrolledStudents,
    getRandomStudentClassmate,
    getStudentById,
    searchEnrolledStudents
} from "../request";
import {getShortSortOrder} from "../../utils/utils.ts";
import {ErrorCatch} from "./error_catch.ts";
import {Enrollment} from "../../entity";

export const fetchEnrolledStudents = (page: number, size: number, sortField?: string, sortOrder?: string) => {
    if (sortField && sortOrder) {
        sortOrder = getShortSortOrder(sortOrder)
        sortField = sortedField(sortField)
        return getEnrolledStudents(page, size, `${sortField}:${sortOrder}`)
    }
    return getEnrolledStudents(page, size)
}

export const fetchStudentById = (id: string) => {
    return getStudentById(id)
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
        return ErrorCatch(err)
    }
}

export const fetchStudentClassmatesRandomly = async (enrolledStudent: Enrollment) => {
    try {
        const resp = await getRandomStudentClassmate(enrolledStudent.student.id, enrolledStudent.classe.id)
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
        return ErrorCatch(err)
    }
}

export const countStudents = async () => {
    try {
        const resp = await countStudent()
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
        return ErrorCatch(err)
    }
}

const sortedField = (sortField: string) => {
    switch (sortField) {
        case 'lastName':
            return 'e.student.personalInfo.lastName'
        default:
            return undefined;
    }
}