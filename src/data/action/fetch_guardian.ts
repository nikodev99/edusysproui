import {ErrorCatch} from "./error_catch.ts";
import {getEnrolledStudentsGuardians, getGuardianById} from "../request";
import {Guardian} from "../../entity";
import {getShortSortOrder} from "../../utils/utils.ts";
import {getSearchedEnrolledStudentGuardian} from "../repository/guardianRepository.ts";

export const fetchEnrolledStudentsGuardians = async (page: number, size: number, sortField?: string, sortOrder?: string) => {
    if (sortField && sortOrder) {
        sortOrder = getShortSortOrder(sortOrder)
        sortField = sortedField(sortField)
        return await getEnrolledStudentsGuardians(page, size, `${sortField}:${sortOrder}`);
    }
    return await getEnrolledStudentsGuardians(page, size)
}

export const fetchSearchedEnrolledStudentsGuardian = async (searchInput: string) => {
    try {
        const resp = await getSearchedEnrolledStudentGuardian(searchInput)
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
        ErrorCatch(e)
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

const sortedField = (sortField: string) => {
    switch (sortField) {
        case 'lastName':
            return 'e.student.guardian.lastName'
        default:
            return undefined;
    }
}