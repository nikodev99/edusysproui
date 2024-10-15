import {getClassesBasicValues} from "../request";
import {ErrorCatch} from "./error_catch.ts";
import {Classe} from "../../entity";

export const findClassesBasicValue = async () => {
    try {
        const resp = await getClassesBasicValues()
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