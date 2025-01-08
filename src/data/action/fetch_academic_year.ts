import {getCurrentAcademicYear} from "../request";
import {AcademicYear} from "../../entity";
import {Response} from "./response.ts";
import {AxiosError} from "axios";

export const findCurrentAcademicYear = async (): Promise<Response<AcademicYear>> => {
    const response = await getCurrentAcademicYear()
    if (response && response.status !== 200) {
        const axiosError = new AxiosError('Error occurred', response.statusText, undefined, response)
         return {
             isSuccess: false,
             error: `${response.status}: ${axiosError.cause?.message}`
         }
    }
    return {
        isSuccess: true,
        data: response.data,
        success: 'data successfully retrieved'
    }
}