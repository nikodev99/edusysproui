import {ErrorCatch} from "./error_catch.ts";
import {getEnrolledStudentsGuardians, getGuardianById} from "../request";
import {Guardian} from "../../entity";

export const fetchEnrolledStudentsGuardians = async () => {
    try {
        const resp = await getEnrolledStudentsGuardians()
        if (resp && resp.status === 200) {
            return {
                isSuccess: true,
                data: resp.data as Guardian[]
            }
        }else {
            return {
                isSuccess: false,
            }
        }
    }catch (e: unknown) {
        ErrorCatch(e)
    }
}

export const fetchGuardian = async (guardianId: string) => {
    try {
        const resp = await getGuardianById(guardianId)
        if (resp && resp.status === 200) {
            return {
                isSuccess: true,
                data: resp.data as Guardian
            }
        }else {
            return {
                isSuccess: false,
            }
        }
    }catch (e: unknown) {
        ErrorCatch(e)
    }
}