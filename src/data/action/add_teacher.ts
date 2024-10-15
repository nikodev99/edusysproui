import {teacherSchema} from "../../schema";
import {TeacherSchema} from "../../utils/interfaces.ts";
import {ErrorCatch} from "./error_catch.ts";
import {AxiosResponse} from "axios";
import {Teacher} from "../../entity";
import {insertTeacher} from "../repository/teacherRepository.ts";
import {Response as CustomResponse} from "./response.ts";

export const addTeacher = async (values: TeacherSchema): Promise<CustomResponse<Teacher>> => {
    const validateFields = teacherSchema.safeParse(values)
    if(!validateFields.success) {
        return {
            isSuccess: false,
            error: `Something went wrong - ${validateFields.error}`
        }
    }

    const data = validateFields.data

    try {
        const resp: AxiosResponse<Teacher> = await insertTeacher(data)
        if (resp.status !== 200) {
            return {
                isSuccess: false,
                error: `Error ${resp.status}: ${resp.statusText} - ${resp.data}`
            }
        }
        return {
            isSuccess: true,
            success: "Enseignant ajouter avec success",
            data: resp.data
        }

    }catch (error: unknown) {
        return ErrorCatch(error)
    }
}