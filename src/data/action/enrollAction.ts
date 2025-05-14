import {EnrollmentSchema, enrollmentSchema, studentSchema} from "../../schema";
import {enrollStudent, updateStudentByField} from "../post";
import {AxiosResponse} from "axios";
import {Enrollment} from "../../entity";
import {Response as CustomResponse} from "./response.ts";
import {ErrorCatch} from "./error_catch.ts";
import {UpdateType} from "../../core/shared/sharedEnums.ts";
import {ID} from "../../core/utils/interfaces.ts";

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

export const updateStudent = async <T>(
    field: keyof T,
    value: unknown,
    studentId: ID,
    type?: UpdateType
): Promise<CustomResponse<string>> => {
    console.log('field: ', field, ' value: ', value)
    const dynamicSchema = studentSchema.pick({[field]: true});
    const validation = dynamicSchema.safeParse({[field]: value});

    console.log('validation: ', validation)

    if (!validation.success) {
        return {
            isSuccess: false,
            error: validation.error.issues[0].message,
            isLoading: false,
        }
    }

    let successMessage: string = 'Modification réussi'

    try {
        const response: AxiosResponse<string> = await updateStudentByField(field, value, studentId, type)
        if (response.status !== 200) {
            return {
                isSuccess: false,
                error: `Error ${response.status}: ${response.data as string}`
            }
        }else {
            successMessage = !Array.isArray(response.data) ? response.data : successMessage
            return {
                isSuccess: true,
                success: successMessage
            }
        }

    }catch (err: unknown) {
        return ErrorCatch(err)
    }
}
