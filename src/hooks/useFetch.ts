import {keepPreviousData, useQuery, UseQueryResult} from "@tanstack/react-query";
import {AxiosResponse} from "axios";
import {Response} from "../data/action/response.ts"
import {ErrorCatch} from "../data/action/error_catch.ts";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const useFetch = <TData, TError>(
    key: string | string[],
    callback: (...args: any[]) => Promise<AxiosResponse<TData, TError | TData[]>>,
    params: any[] = []
): UseQueryResult<TData, TError | TData[]> => {
    return  useQuery<TData, TError | TData[]>({
        queryKey: Array.isArray(key) ? key : [key],
        queryFn: async () => await callback(...params).then(res => res.data),
        placeholderData: keepPreviousData
    })
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const customFetch = async <T>(
    callback: (...args: any[]) => Promise<AxiosResponse<T | T[]>>,
    params: any[] = []
): Promise<Response<T | T[]>> => {
    let loading = true
    try {
        const response = await callback(...params);
        loading = response.status === 200
        if(response && response.status === 200) {
            loading = false
            return {
                isSuccess: true,
                data: response.data as T | T[],
                error: '',
                success: 'Data successfully fetched',
                isLoading: loading
            }
        }else {
            return {
                isSuccess: false,
                error: `${response.status}: ${response.statusText}`,
                success: '',
                data: [] as T | T[],
                isLoading: loading
            }
        }
    }catch (error: unknown) {
        ErrorCatch(error)
    }
    return {
        isSuccess: false,
        isLoading: loading
    }
}