import {EnrollmentSchema} from "../../utils/interfaces.ts";
import {enrollmentSchema} from "../../schema";
import {enrollStudent} from "../post";
import {AxiosResponse} from "axios";
import {Enrollment} from "../../entity";
import {Response} from "./response.ts";
import {ErrorCatch} from "./error_catch.ts";

export const addStudent = async (values: EnrollmentSchema): Promise<Response<Enrollment>> => {
    console.log('les valeurs: ', values);

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
        ErrorCatch(err)
    }
    return {
        isSuccess: true,
        success: 'Student successfully added'
    }
}