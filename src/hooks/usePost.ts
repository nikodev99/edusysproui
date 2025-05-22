import {AxiosError, AxiosResponse} from "axios";
import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import {Response} from "../data/action/response.ts";
import {ErrorCatch} from "../data/action/error_catch.ts";
import {z} from "zod";

type PostFunction<TData, TParams = void> = (data: TData, Params?: TParams) => Promise<AxiosResponse<TData>>

export const useQueryPost = <TData, TParams = void>(
    schema: z.ZodSchema<TData>,
    options?: Omit<UseMutationOptions<AxiosResponse<TData>, AxiosError, {postFn: PostFunction<TData, TParams>; data: TData; params?: TParams}>, "mutationFn">
) => {
    return useMutation<AxiosResponse<TData>, AxiosError, {postFn: PostFunction<TData, TParams>; data: TData; params?: TParams}>({
        mutationFn: async ({postFn, data, params}) => {
            const validate = schema.safeParse(data)
            if (!validate.success) {
                throw new AxiosError(`Donnée non valide: \n${validate.error.errors.map(e => e.message).join('\n')}.`)
            }
            return postFn(validate.data, params)
        },
        ...options,
    })
}

export const usePost = async <TData, TParams>(postFn: PostFunction<TData, TParams>, data: TData): Promise<Response<TData>> => {
    try {
        const resp: AxiosResponse<TData> = await postFn(data)
        if (resp.status !== 200) {
            return {
                isSuccess: false,
                error: `Error ${resp.status}: ${resp.statusText} - ${resp.data}`
            }
        }
        return {
            isSuccess: true,
            data: resp.data
        }

    }catch (error: unknown) {
        return ErrorCatch(error)
    }
}