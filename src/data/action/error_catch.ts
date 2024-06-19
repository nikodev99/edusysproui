import {isAxiosError} from "../axiosConfig.ts";
import {Response} from "./response.ts";

export const ErrorCatch = (err: unknown): Response => {
    if (isAxiosError(err)) {
        if (err.response) {
            return {
                isSuccess: false,
                error: `Error ${err.status}: ${err.message}`
            }
        }
        return {
            isSuccess: false,
            error: `Error ${err.message}`
        }
    }else {
        return {
            isSuccess: false,
            error: `Unexpected error occurred ${err}`
        };
    }
}