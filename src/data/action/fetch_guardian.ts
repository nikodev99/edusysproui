import {ErrorCatch} from "./error_catch.ts";
import {
    getEnrolledStudentsGuardians,
    getGuardianById,
    getGuardianWithStudentsById,
    getSearchedEnrolledStudentGuardian
} from "../request";
import {Guardian} from "../../entity";
import {getShortSortOrder, setSortFieldName} from "../../core/utils/utils.ts";
import {loggedUser} from "../../auth/jwt/LoggedUser.ts";

const schoolId: string = loggedUser.getSchool()?.id as string;

export const fetchEnrolledStudentsGuardians = async (page: number, size: number, sortField?: string, sortOrder?: string) => {
    if (sortField && sortOrder) {
        sortOrder = getShortSortOrder(sortOrder)
        sortField = sortedField(sortField)
        return await getEnrolledStudentsGuardians(schoolId, page, size, `${sortField}:${sortOrder}`);
    }
    return await getEnrolledStudentsGuardians(schoolId, page, size)
}

export const fetchSearchedEnrolledStudentsGuardian = async (searchInput: string) => {
    try {
        const resp = await getSearchedEnrolledStudentGuardian(schoolId, searchInput)
        if (resp && resp.status === 200) {
            return {
                isSuccess: true,
                data: resp.data as Guardian[]
            }
        }else {
            return {
                isSuccess: false,
            }
        }
    }catch (e: unknown) {
        return ErrorCatch(e)
    }
}

export const fetchGuardian = async (guardianId: string) => {
    try {
        const resp = await getGuardianById(guardianId)
        if (resp && resp.status === 200) {
            return {
                isSuccess: true,
                data: resp.data as Guardian
            }
        }else {
            return {
                isSuccess: false,
            }
        }
    }catch (e: unknown) {
        ErrorCatch(e)
    }
}

export const fetchGuardianWithStudents = async (guardianId: string) => {
    return await getGuardianWithStudentsById(guardianId)
}

const sortedField = (sortField: string | string[]) => {
    switch (setSortFieldName(sortField)) {
        case 'lastName':
            return 'e.student.guardian.personalInfo.lastName'
        default:
            return undefined;
    }
}