import {z} from "zod";
import {useMutation} from "@tanstack/react-query";
import {AxiosError, AxiosResponse} from "axios";
import {ID} from "../core/utils/interfaces.ts";
import {Response} from "../data/action/response.ts";
import {ErrorCatch} from "../data/action/error_catch.ts";

type PutFunction<TData, TReturn> = (data: TData, id: ID) => Promise<AxiosResponse<TReturn, unknown>>

export const useQueryUpdate = <TData, TReturn>(schema: z.ZodSchema<TData>) => {
    return useMutation<AxiosResponse<TReturn>, unknown, {putFn: PutFunction<TData, TReturn>, data: TData, id: ID}>({
        mutationFn: async ({putFn, data, id}) => {
            const validate = schema.safeParse(data)
            if (!validate.success) {
                throw new AxiosError(`Donnée non valide: \n${validate.error.errors.map(e => e.message).join('\n')}.`)
            }
            return putFn(data, id)
        }
    })
}

export const useUpdate = async <TData, TReturn>(putFn: PutFunction<TData, TReturn>, data: TData, id: ID): Promise<Response<TData>> => {
    try {
        const resp: AxiosResponse<TReturn> = await putFn(data, id)
        if (resp.status !== 200) {
            return {
                isSuccess: false,
                error: `Error ${resp.status}: ${resp.statusText} - ${resp.data}`
            }
        }
        return {
            isSuccess: true,
            data: resp.data as unknown as TData
        }

    }catch (error: unknown) {
        return ErrorCatch(error)
    }
}