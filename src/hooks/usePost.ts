import {AxiosError, AxiosResponse} from "axios";
import {useMutation} from "@tanstack/react-query";
import {Response} from "../data/action/response.ts";
import {ErrorCatch} from "../data/action/error_catch.ts";
import {z} from "zod";

type PostFunction<TData> = (data: TData) => Promise<AxiosResponse<TData>>

export const useQueryPost = <TData>(schema: z.ZodSchema<TData>) => {
    return useMutation<AxiosResponse<TData>, unknown, {postFn: PostFunction<TData>; data: TData}>({
        mutationFn: async ({postFn, data}) => {
            const validate = schema.safeParse(data)
            if (!validate.success) {
                throw new AxiosError(`Donnée non valide: \n${validate.error.errors.map(e => e.message).join('\n')}.`)
            }
            return postFn(validate.data)
        }
    })
}

export const usePost = async <TData>(postFn: PostFunction<TData>, data: TData): Promise<Response<TData>> => {
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