import {EnrollmentSchema} from "../../utils/interfaces.ts";
import {enrollmentSchema} from "../../schema";
import {enrollStudent} from "../post";

export const addStudent = async (values: EnrollmentSchema) => {
    console.log('les valeurs: ', values);
    const validateFields = enrollmentSchema.safeParse(values)
    if (!validateFields.success) {
        return {
            isSuccess: false,
            error: 'Something went wrong'
        };
    }

    const data = validateFields.data
    console.log(data)

    //await enrollStudent(data)

    return {
        isSuccess: true,
        success: 'Student successfully added'
    };
}