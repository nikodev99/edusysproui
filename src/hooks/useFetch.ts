import {keepPreviousData, QueryKey, useQuery, UseQueryOptions, UseQueryResult} from "@tanstack/react-query";
import {AxiosResponse} from "axios";
import {Response} from "../data/action/response.ts"
import {ErrorCatch} from "../data/action/error_catch.ts";
import {useCallback} from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const useFetch = <TData, TError>(
    key: unknown | unknown[],
    callback: (...args: any[]) => Promise<AxiosResponse<TData | TData[], TError>>,
    params: any[] = [],
    options?: UseQueryOptions<TData | TData[], TError, TData | TData[], QueryKey>
): UseQueryResult<TData | TData[], TError> => {
    return  useQuery<TData | TData[], TError>({
        queryKey: Array.isArray(key) ? key : [key],
        queryFn: async () => await callback(...params).then(res => res.data),
        placeholderData: keepPreviousData,
        ...options,
    })
}

export const useRawFetch = <T extends object>() => {
    return useCallback((callback: (...args: any[]) => Promise<AxiosResponse<T | T[]>>, params: any[] = []) => {
        return customFetch(callback, params);
    }, []);
};

export const fetchFunc = <T extends object>(callback: (...args: any[]) => Promise<AxiosResponse<T | T[]>>, params: any[] = []) => {
    return customFetch(callback, params);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const customFetch = async <T>(
    callback: (...args: any[]) => Promise<AxiosResponse<T | T[]>>,
    params: any[] = []
): Promise<Response<T | T[]>> => {
    try {
        const response = await callback(...params);
        if(response && response.status === 200) {
            return {
                isSuccess: true,
                data: response.data as T | T[],
                error: '',
                success: 'Data successfully fetched',
                isLoading: false
            }
        }else {
            return {
                isSuccess: false,
                error: `${response.status}: ${response.statusText}`,
                success: '',
                data: [] as T | T[],
                isLoading: false
            }
        }
    }catch (error: unknown) {
        ErrorCatch(error)
        return {
            isSuccess: false,
            data: [] as T | T[],
            error: 'An error occurred during the fetch operation',
            success: '',
            isLoading: false
        };
    }
}