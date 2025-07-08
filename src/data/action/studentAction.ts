import {
    countStudent,
    getEnrolledStudents,
    getRandomStudentClassmate,
    getStudentById
} from "../request";
import {getShortSortOrder} from "../../core/utils/utils.ts";
import {ErrorCatch} from "./error_catch.ts";
import {Enrollment} from "../../entity";
import {getClasseEnrolledStudents} from "../repository/studentRepository.ts";
import {loggedUser} from "../../auth/jwt/LoggedUser.ts";

const schoolId: string = loggedUser.getSchool()?.id as string;

export const fetchEnrolledStudents = (page: number, size: number, sortField?: string, sortOrder?: string) => {
    if (sortField && sortOrder) {
        sortOrder = getShortSortOrder(sortOrder)
        sortField = sortedField(sortField)
        return getEnrolledStudents(schoolId, page, size, `${sortField}:${sortOrder}`)
    }
    return getEnrolledStudents(schoolId, page, size)
}

export const fetchStudentById = (id: string) => {
    return getStudentById(id)
}

export const fetchEnrolledClasseStudents = (
    classeId: number,
    academicYear: string,
    page: number,
    size: number,
    sortField?: string,
    sortOrder?: string,
) => {
    if (sortField && sortOrder) {
        sortOrder = getShortSortOrder(sortOrder)
        sortField = sortedField(sortField)
        return getClasseEnrolledStudents(classeId, academicYear, {page: page, size: size}, `${sortField}:${sortOrder}`)
    }
    return getClasseEnrolledStudents(classeId, academicYear, {page: page, size: size})
}

export const fetchStudentClassmatesRandomly = async (enrolledStudent: Enrollment) => {
    try {
        const resp = await getRandomStudentClassmate(schoolId, enrolledStudent.student.id, enrolledStudent.classe.id)
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
        const resp = await countStudent(schoolId)
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
        case 'lastEnrolledDate':
            return 'e.enrollmentDate'
        case 'age':
            return 'e.student.personalInfo.birthDate'
        default:
            return undefined;
    }
}