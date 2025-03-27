import {z} from "zod";
import {useMutation} from "@tanstack/react-query";
import {AxiosError, AxiosResponse} from "axios";
import {ID} from "../core/utils/interfaces.ts";
import {Response} from "../data/action/response.ts";
import {ErrorCatch} from "../data/action/error_catch.ts";

type PutFunction<TData> = (data: TData, id: ID) => Promise<AxiosResponse<TData>>

export const useQueryUpdate = <TData>(schema: z.ZodSchema<TData>) => {
    return useMutation<AxiosResponse<TData>, unknown, {putFn: PutFunction<TData>, data: TData, id: ID}>({
        mutationFn: async ({putFn, data, id}) => {
            const validate = schema.safeParse(data)
            console.log('DATA: ', schema.safeParse(data))
            if (!validate.success) {
                throw new AxiosError(`Donnée non valide: \n${validate.error.errors.map(e => e.message).join('\n')}.`)
            }
            return putFn(data, id)
        }
    })
}

export const useUpdate = async <TData>(putFn: PutFunction<TData>, data: TData, id: ID): Promise<Response<TData>> => {
    try {
        const resp: AxiosResponse<TData> = await putFn(data, id)
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