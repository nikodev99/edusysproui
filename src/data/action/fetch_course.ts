import {Course} from "../../entity";
import {ErrorCatch} from "./error_catch.ts";
import {getAllCourses} from "../repository/courseRepository.ts";
import {Response} from "./response.ts";

export const fetchAllCourses = async (): Promise<Response<Course[]>> => {
    try {
        const resp = await getAllCourses()
        if (resp && 'data' in resp) {
            return {
                isSuccess: true,
                data: resp.data as Course[]
            }
        }else {
            return {
                isSuccess: false
            }
        }
    }catch (err: unknown) {
        return ErrorCatch(err)
    }
}