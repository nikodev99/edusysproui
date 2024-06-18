import {EnrollmentSchema} from "../../utils/interfaces.ts";
import {enrollmentSchema} from "../../schema";
import {enrollStudent} from "../post";
import {AxiosError, AxiosResponse} from "axios";
import {Enrollment} from "../../entity/enrollment.ts";

interface AddStudentResponse {
    isSuccess: boolean;
    error?: string;
    success?: string;
}

export const addStudent = async (values: EnrollmentSchema) => {
    console.log('les valeurs: ', values);

    const validateFields = enrollmentSchema.safeParse(values)
    if (!validateFields.success) {
        return {
            isSuccess: false,
            error: 'Something went wrong'
        }
    }

    const data = validateFields.data
    console.log(data)

    try {
        const resp: AxiosResponse<Enrollment> | AddStudentResponse = await enrollStudent(data).catch((err: AxiosError) => {
            if (err.response) {
                return {
                    isSuccess: false,
                    error: `Error ${err.response.status}: ${err.message}`
                };
            }else {
                return {
                    isSuccess: false,
                    error: `Error encounter: ${err.message}`
                }
            }
        })

        if ('isSuccess' in resp && !resp.isSuccess) {
            return resp as AddStudentResponse
        }

        if ('status' in resp && 'statusText' in resp) {
            if ( resp.status === 200)  {
                return {
                    isSuccess: true,
                    success: 'Student successfully added'
                }
            }else {
                return {
                    isSuccess: false,
                    error: `Error ${resp.status}: ${resp.statusText}`
                }
            }
        }
    } catch (err) {
        return {
            isSuccess: false,
            error: 'Unexpected error occurred'
        }
    }
}