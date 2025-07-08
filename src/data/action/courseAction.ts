import {Course} from "../../entity";
import {ErrorCatch} from "./error_catch.ts";
import {getAllBasicCourses, getAllCourses} from "../repository/courseRepository.ts";
import {Response} from "./response.ts";
import {AxiosResponse} from "axios";
import {getShortSortOrder, setSortFieldName} from "../../core/utils/utils.ts";
import {loggedUser} from "../../auth/jwt/LoggedUser.ts";

const schoolId: string = loggedUser.getSchool()?.id as string;

export const getAllSchoolCourses = async (page: number, size: number, sortField?: string, sortOrder?: string): Promise<AxiosResponse<Course[]>> => {
    if(sortField && sortOrder) {
        sortOrder = getShortSortOrder(sortOrder)
        sortField = sortedField(sortField);
        return await getAllCourses(schoolId, {page: page, size: size}, `${sortField}:${sortOrder}`);
    }
    return await getAllCourses(schoolId, {page: page, size: size})
}

export const fetchAllCourses = async (): Promise<Response<Course[]>> => {
    try {
        const resp = await getAllBasicCourses(schoolId)
        if (resp && 'data' in resp) {
            return {
                isSuccess: true,
                data: resp.data as Course[]
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

const sortedField = (sortField: string | string[]) => {
    switch (setSortFieldName(sortField)) {
        case 'course':
            return 'c.course'
        case 'abbr':
            return 'c.abbr'
        case 'name':
            return 'c.department.name'
        case 'code':
            return 'c.department.code'
        case 'createdAt':
            return 'c.createdAt'
        default:
            return undefined;
    }
}