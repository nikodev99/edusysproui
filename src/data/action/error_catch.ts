import {isAxiosError} from "../axiosConfig.ts";

export const ErrorCatch = (err: unknown) => {
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