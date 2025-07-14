import {z} from "zod";
import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import {AxiosError, AxiosResponse} from "axios";
import {
    ID,
    MutationPutVariables,
    PutFunction,
    UpdateReturnType,
    UseQueryOptions,
    UseUpdateReturn
} from "../core/utils/interfaces.ts";
import {Response} from "../data/action/response.ts";
import {catchError, ErrorCatch} from "../data/action/error_catch.ts";
import {useState} from "react";

export const useQueryUpdate = <TData, TParams extends readonly unknown[] = []>(
    schema: z.ZodSchema<TData>,
    options?: Omit<
        UseMutationOptions<
            AxiosResponse<TData>,
            AxiosError,
            MutationPutVariables<TData, TParams>
        >, "mutationFn">
) => {
    return useMutation<AxiosResponse<TData>, AxiosError, MutationPutVariables<TData, TParams>>({
        mutationFn: async ({putFn, data, params, id}) => {
            const validate = schema.safeParse(data)
            if (!validate.success) {
                throw new AxiosError(
                    `Donnée non valide: \n${validate.error.errors.map(e => e.message).join('\n')}.`,
                    'VALIDATION_ERROR'
                )
            }
            if (params === undefined) {
                return (putFn as unknown as PutFunction<TData, []>)(validate.data, id)
            }
            return putFn(validate.data, id, ...params as never)
        },
        ...options
    })
}

export const usePut = async <TData, TParams extends readonly unknown[] = []>(
    putFn: PutFunction<TData, TParams>,
    data: TData,
    id?: ID,
    params?: TParams
): Promise<Response<TData>> => {
    try {
        const resp: AxiosResponse<TData> = await putFn(data, id, ...params as never)
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

export const useUpdate = <
    TData,
    TReturn extends object | boolean,
    TParams extends readonly unknown[] = []
>(schema: z.ZodSchema<TData>, func: PutFunction<TData, TParams>, options?: UseQueryOptions<TData, TParams>): UseUpdateReturn<TData, TReturn, TParams> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { mutate, isError, failureReason, isPending, isPaused } = useQueryUpdate(schema, options);
    const [result, setResult] = useState<TReturn | undefined>(undefined);
    const [error, setError] = useState<unknown | null>(null);
    const [status, setStatus] = useState<number>(0)
    const [code, setCode] = useState<string | undefined>(undefined)

    const update = async (data: TData, id?: ID, params?: TParams): UpdateReturnType<TReturn> => {
        return new Promise((resolve) => {
            setResult(undefined);
            setError(null);
            setStatus(0)
            setCode(undefined)

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            mutate({putFn: func, data: data, id: id, params: params}, {
                onSuccess: (response) => {
                    const success = response.status === 200;
                    const data = success ? (response.data as unknown as TReturn) : undefined;

                    setResult(data);
                    setStatus(response.status);
                    setCode(response.statusText)
                    resolve({ success, data, status: status, code: code });
                },
                onError: (error) => {
                    const errorMessage = catchError(error);
                    setError(errorMessage);
                    setStatus(error.response?.status as number);
                    setCode(error.code as string)
                    resolve({ success: false, error: errorMessage, status: status, code: code });
                }
            })
        })
    }

    return {update, result, error, isLoading: isPending || isPaused, isError, failureReason};
}