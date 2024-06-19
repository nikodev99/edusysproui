import {EnrollmentSchema} from "../../utils/interfaces.ts";
import {enrollmentSchema} from "../../schema";
import {enrollStudent} from "../post";
import axios, {AxiosError, AxiosResponse} from "axios";
import {Enrollment} from "../../entity";

interface AddStudentResponse {
    isSuccess: boolean,
    error?: string
    success?: string
}

const isAxiosError = (err: unknown): err is AxiosError => {
    return axios.isAxiosError(err)
}

export const addStudent = async (values: EnrollmentSchema): Promise<AddStudentResponse> => {
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
        if (isAxiosError(err)) {
            if (err.response) {
                return {
                    isSuccess: false,
                    error: `Error ${err.status}: ${err.message}`
                }
            }
            return {
                isSuccess: false,
                error: `Error ${err.message}`
            }
        }else {
            return {
                isSuccess: false,
                error: `Unexpected error occurred ${err}`
            };
        }

    }
    return {
        isSuccess: true,
        success: 'Student successfully added'
    }
}