import {getClassesBasicValues} from "../request";
import {ErrorCatch} from "./error_catch.ts";
import {Classe} from "../../entity";

export const findClassesBasicValue = async () => {
    try {
        const resp = await getClassesBasicValues()
        if (resp && 'data' in resp) {
            return {
                isSuccess: true,
                data: resp.data as Classe[]
            }
        }else {
            return {
                isSuccess: false
            }
        }
    }catch (err: unknown) {
        ErrorCatch(err)
    }
}