import {getClassesBasicValues} from "../request";
import {ErrorCatch} from "./error_catch.ts";
import {Classe} from "../../entity";
import {loggedUser} from "../../auth/jwt/LoggedUser.ts";

const schoolId: string = loggedUser.getSchool()?.id as string;

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
