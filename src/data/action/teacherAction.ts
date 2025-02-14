import {getShortSortOrder, setSortFieldName} from "../../utils/utils.ts";
import {getAllTeachers, getNumberOfStudentTaughtByTeacher, getTeacherById} from "../repository/teacherRepository.ts";
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

const sortedField = (sortField: string[] | string) => {
    return getSorted(setSortFieldName(sortField))
}


const getSorted = (sortField: string) => {
    switch (sortField) {
        case 'lastName':
            return 't.personalInfo.lastName'
        case 'gender':
            return 't.personalInfo.gender'
        case 'birthDate':
            return 't.personalInfo.birthDate'
        case 'status':
            return 't.personalInfo.status'
        default:
            return undefined;
    }
}
