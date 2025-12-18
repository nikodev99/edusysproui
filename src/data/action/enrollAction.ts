import {EnrollmentSchema, enrollmentSchema} from "@/schema";
import {enrollStudent} from "../post";
import {AxiosResponse} from "axios";
import {Enrollment} from "@/entity";
import {ResponseRepo as CustomResponse} from "./responseRepo.ts";
import {catchError} from "./error_catch.ts";

export const addStudent = async (values: EnrollmentSchema, isRerun: boolean = false): Promise<CustomResponse<Enrollment>> => {

    const validateFields = enrollmentSchema(isRerun).safeParse(values)
    if (!validateFields.success) {
        return {
            isSuccess: false,
            error: 'Something went wrong',
        }
    }

    const data = validateFields.data

    try {
        const resp: AxiosResponse<Enrollment> = await enrollStudent(data)
        if (resp.status >= 200 && resp.status < 300) {
            return {
                isSuccess: true,
                data: resp.data,
                success: 'Student successfully added'
            }
        }else {
            return {
                isSuccess: false,
                error: `Error ${resp.status}: ${resp.statusText}`
            }
        }
    } catch (err: unknown) {
        return {
            isSuccess: false,
            error: catchError(err) as string
        }
    }
}