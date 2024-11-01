import {getShortSortOrder} from "../../utils/utils.ts";
import {
    getAllTeachers,
    getNumberOfStudentTaughtByTeacher,
    getSearchedTeachers,
    getTeacherById
} from "../repository/teacherRepository.ts";
import {Teacher} from "../../entity";
import {ErrorCatch} from "./error_catch.ts";
import {Counted} from "../../utils/interfaces.ts";

export const fetchTeachers = async (page: number, size: number, sortField?: string, sortOrder?: string) => {
    if (sortField && sortOrder) {
        sortOrder = getShortSortOrder(sortOrder);
        sortField = sortedField(sortField);
        return await getAllTeachers(page, size, `${sortField}:${sortOrder}`);
    }
    return await getAllTeachers(page, size)
}

export const fetchTeacherById = async (teacherId: string) => {
    return await getTeacherById(teacherId)
}

export const fetchSearchedTeachers = async (searchInput: string) => {
    try {
        const resp = await getSearchedTeachers(searchInput)
        if (resp && resp.status === 200) {
            return {
                isSuccess: true,
                data: resp.data as Teacher[]
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

export const count = async (teacherId: string) => {
    try {
        const resp = await getNumberOfStudentTaughtByTeacher(teacherId)
        if (resp && resp.status === 200) {
            return {
                isSuccess: true,
                data: resp.data as Counted
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

const sortedField = (sortField: string) => {
    switch (sortField) {
        case 'lastName':
            return 't.lastName'
        case 'gender':
            return 't.gender'
        case 'birthDate':
            return 't.birthDate'
        case 'status':
            return 't.status'
        default:
            return undefined;
    }
}