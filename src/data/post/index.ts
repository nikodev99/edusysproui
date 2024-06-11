import {request} from "../axiosConfig.ts";
import {EnrollmentSchema} from "../../utils/interfaces.ts";


export const enrollStudent = (data: EnrollmentSchema) => {
    return request({
        method: 'POST',
        url: '/enroll',
        data: data,
        headers: {'Content-Type': 'application/json'},
    })
}