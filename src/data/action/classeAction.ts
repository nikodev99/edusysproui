import {getClassesBasicValues} from "../request";
import {ErrorCatch} from "./error_catch.ts";
import {Classe} from "../../entity";
import {AxiosResponse} from "axios";
import {getShortSortOrder, setSortFieldName} from "../../core/utils/utils.ts";
import {getAllClasses} from "../repository/classeRepository.ts";
import {loggedUser} from "../../auth/jwt/LoggedUser.ts";

const schoolId: string = loggedUser.getSchool()?.id as string;

export const getAllSchoolClasses = async (page: number, size: number, sortField?: string, sortOrder?: string): Promise<AxiosResponse<Classe[]>> => {
    if(sortField && sortOrder) {
        sortOrder = getShortSortOrder(sortOrder)
        sortField = sortedField(sortField);
        return await getAllClasses(schoolId, {page: page, size: size}, `${sortField}:${sortOrder}`);
    }
    return await getAllClasses(schoolId, {page: page, size: size})
}

export const findClassesBasicValue = async () => {
    try {
        const resp = await getClassesBasicValues(schoolId)
        if (resp && 'data' in resp) {
            return {
                isSuccess: true,
                data: resp.data as Classe[],
                isLoading: false
            }
        }else {
            return {
                isSuccess: false,
                isLoading: false
            }
        }
    }catch (err: unknown) {
        return ErrorCatch(err)
    }
}

const sortedField = (sortField: string | string[]) => {
    switch (setSortFieldName(sortField)) {
        case 'name':
            return 'c.name'
        default:
            return undefined;
    }
}