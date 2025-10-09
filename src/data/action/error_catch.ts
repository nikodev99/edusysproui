import {isAxiosError} from "../axiosConfig.ts";
import {isString} from "../../core/utils/utils.ts";

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

export const catchError = (err: unknown) => {
    if (isAxiosError(err)) {
        if (err.response) {
            if (err?.response?.data
                && typeof err?.response?.data === 'object'
                && 'error' in err.response.data
            ) {
                return err.response?.data.error;
            }
            if (err?.response?.data
                && typeof err?.response?.data === 'object'
                && 'message' in err.response.data
            ) {
                return err.response?.data.message;
            }
            if (err?.response?.data && isString(err?.response?.data)) {
                return err.response?.data
            }else {
                return err?.message
            }
        }else {
            return err.message
        }
    }
}