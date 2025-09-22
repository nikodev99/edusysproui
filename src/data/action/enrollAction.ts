import {EnrollmentSchema, enrollmentSchema} from "../../schema";
import {enrollStudent} from "../post";
import {AxiosResponse} from "axios";
import {Enrollment} from "../../entity";
import {ResponseRepo as CustomResponse} from "./responseRepo.ts";
import {ErrorCatch} from "./error_catch.ts";

export const addStudent = async (values: EnrollmentSchema): Promise<CustomResponse<Enrollment>> => {

    const validateFields = enrollmentSchema.safeParse(values)
    if (!validateFields.success) {
        return {
            isSuccess: false,
            error: 'Something went wrong',
        }
    }

    const data = validateFields.data

    try {
        const resp: AxiosResponse<Enrollment> = await enrollStudent(data)
        if ( resp.status !== 200) {
            return {
                isSuccess: false,
                error: `Error ${resp.status}: ${resp.statusText}`
            }
        }
    } catch (err: unknown) {
        return ErrorCatch(err)
    }
    return {
        isSuccess: true,
        success: 'Student successfully added'
    }
}