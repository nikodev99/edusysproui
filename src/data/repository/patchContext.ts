import {UpdateType} from "@/core/shared/sharedEnums.ts";
import {request} from "../axiosConfig.ts";
import {ID} from "@/core/utils/interfaces.ts";
import {ResponseRepo as CustomResponse} from "../action/responseRepo.ts";
import {studentSchema} from "@/schema";
import {ErrorCatch} from "../action/error_catch.ts";

export class PatchContext {
    patchPath = <T>(field: keyof T, value: unknown, entityId: string | number | bigint, type?: UpdateType) => {
        let url: string
        switch (type) {
            case UpdateType.ADDRESS:
                url = '/student/address'
                break
            case UpdateType.HEALTH:
                url = '/student/health'
                break
            case UpdateType.GUARDIAN:
                url = '/student/guardian'
                break
            case UpdateType.INFO:
                url = '/student/info'
                break
            case UpdateType.TEACHER:
                url = '/teachers'
                break
            case UpdateType.ASSIGNMENT:
                url = '/assignment'
                break
            case UpdateType.EMPLOYEE:
                url = '/employee'
                break
            case UpdateType.SCHOOL:
                url = '/school'
                break
            case UpdateType.ACADEMIC_YEAR:
                url = '/academic'
                break
            case UpdateType.REPRIMAND:
                url = '/blame'
                break
            case UpdateType.PUNISHMENT:
                url = '/blame/punishment'
                break
            case UpdateType.CONTRACT:
                url = '/employee/contract'
                break
            case UpdateType.GRADE:
                url = '/grades'
                break
            default:
                url = '/student'
                break
        }
        return request({
            method: 'PATCH',
            url: `${url}/${entityId}`,
            data: {
                field: field,
                value: value,
            }
        })
    }

    patch = async <T>(
        field: keyof T,
        value: unknown,
        studentId: ID,
        type?: UpdateType
    ): Promise<CustomResponse<string>> => {
        const dynamicSchema = studentSchema.pick({[field]: true as never});
        const validation = dynamicSchema.safeParse({[field]: value});

        if (!validation.success) {
            return {
                isSuccess: false,
                error: validation.error.issues[0].message,
                isLoading: false,
            }
        }

        let successMessage: string = 'Modification réussi'

        try {
            const response = await this.patchPath(field, value, studentId, type)
            if (response.status !== 200) {
                return {
                    isSuccess: false,
                    error: `Error ${response.status}: ${typeof response.data === "string" ? response.data : ''}`
                }
            }else {
                successMessage = !Array.isArray(response.data) && typeof response.data === 'string' ? response.data as string : successMessage as string
                return {
                    isSuccess: true,
                    success: successMessage
                }
            }

        }catch (err: unknown) {
            return ErrorCatch(err)
        }
    }
}

export const patchContext = new PatchContext()