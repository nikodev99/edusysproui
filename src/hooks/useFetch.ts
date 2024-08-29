import {keepPreviousData, useQuery, UseQueryResult} from "@tanstack/react-query";
import {AxiosResponse} from "axios";
import {Response} from "../data/action/response.ts"
import {ErrorCatch} from "../data/action/error_catch.ts";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const useFetch = <TData, TError>(
    key: string | string[],
    callback: (...args: any[]) => Promise<AxiosResponse<TData, TError | TData[]>>,
    params: unknown[] = []
): UseQueryResult<TData, TError | TData[]> => {
    return  useQuery<TData, TError | TData[]>({
        queryKey: Array.isArray(key) ? key : [key],
        queryFn: async () => await callback(...params).then(res => res.data),
        placeholderData: keepPreviousData
    })
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const useCustomFetch = async <T>(
    callback: (...args: any[]) => Promise<AxiosResponse<T | T[]>>,
    params: unknown[]
): Promise<Response<T | T[]>> => {
    try {
        const response = await callback(...params);
        if(response && response.status === 200) {
            return {
                isSuccess: true,
                data: response.data as T | T[]
            }
        }else {
            return {
                isSuccess: false,
            }
        }
    }catch (error: unknown) {
        ErrorCatch(error)
    }
    return {
        isSuccess: false
    }
}