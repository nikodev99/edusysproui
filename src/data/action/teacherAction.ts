import {getShortSortOrder, setSortFieldName} from "@/core/utils/utils.ts";
import {getAllTeachers, getTeacherById} from "../repository/teacherRepository.ts";
import {loggedUser} from "@/auth/jwt/LoggedUser.ts";

const schoolId: string = loggedUser.getSchool()?.id as string;

export const fetchTeachers = async (page: number, size: number, sortField?: string, sortOrder?: string) => {
    if (sortField && sortOrder) {
        sortOrder = getShortSortOrder(sortOrder);
        sortField = sortedField(sortField);
        return await getAllTeachers(schoolId, page, size, `${sortField}:${sortOrder}`);
    }
    return await getAllTeachers(schoolId, page, size)
}

export const fetchTeacherById = async (teacherId: string) => {
    return await getTeacherById(teacherId, schoolId)
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
