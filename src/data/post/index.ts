import {request} from "../axiosConfig.ts";
import {EnrollmentSchema} from "../../utils/interfaces.ts";
import {Enrollment} from "../../entity/enrollment.ts";
import {AxiosResponse} from "axios";


export const enrollStudent = (data: EnrollmentSchema): Promise<AxiosResponse<Enrollment>> => {
    return request({
        method: 'POST',
        url: '/enroll',
        data: data,
        headers: {'Content-Type': 'application/json'},
    })
}