import {AxiosError, AxiosResponse} from "axios";
import {useMutation} from "@tanstack/react-query";
import {ResponseRepo} from "../data/action/responseRepo.ts";
import {catchError, ErrorCatch} from "../data/action/error_catch.ts";
import {z} from "zod";
import {useState} from "react";
import {
    InsertReturnType,
    MutationPostVariables,
    PostFunction,
    UseInsertReturn,
    UseQueryOptions
} from "../core/utils/interfaces.ts";

/**
 * A flexible hook for POST mutations that validates data with Zod schemas
 * and supports functions with varying parameter signatures.
 *
 * Key features:
 * - Validates data against Zod schema before sending
 * - Supports functions with no additional params: (data) => Promise<Response>
 * - Supports functions with params: (data, ...params) => Promise<Response>
 * - Type-safe parameter handling with full TypeScript inference
 *
 * @param schema - Zod schema for validating the data
 * @param options - Additional options for the mutation (excluding mutationFn)
 */
export const useQueryPost = <TData, TParams extends readonly unknown[] = []>(
    schema: z.ZodSchema<TData>,
    options?: UseQueryOptions<TData, TParams>
) => {
    return useMutation<AxiosResponse<TData>, AxiosError, MutationPostVariables<TData, TParams>>({
        mutationFn: async ({postFn, data, params}) => {
            const validate = schema.safeParse(data)
            if (!validate.success) {
                throw new AxiosError(
                    `Donnée non valide: \n${validate.error.errors.map(e => e.message).join('\n')}.`,
                    'VALIDATION_ERROR'
                )
            }
            if (params === undefined) {
                return (postFn as unknown as PostFunction<TData, []>)(validate.data)
            }
            return postFn(validate.data, ...params as never)
        },
        ...options,
    })
}

export const usePost = async <TData, TParams extends readonly unknown[] = []>(
    postFn: PostFunction<TData, TParams>,
    data: TData,
    params: TParams
): Promise<ResponseRepo<TData>> => {
    try {
        const resp: AxiosResponse<TData> = await postFn(data, ...params)
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

export const useInsert = <
    TData,
    TReturn extends object | boolean,
    TParams extends readonly unknown[] = []
>(schema: z.ZodSchema, func: PostFunction<TData, TParams>, options?: UseQueryOptions<TData, TParams>): UseInsertReturn<TData, TReturn, TParams> => {
    const { mutate, isError, failureReason, isPending, isPaused } = useQueryPost(schema, options);
    const [result, setResult] = useState<TReturn | undefined>(undefined);
    const [error, setError] = useState<unknown | null>(null);
    const [status, setStatus] = useState<number>(0)
    const [code, setCode] = useState<string | undefined>(undefined)

    const insert = async (data: TData, params?: TParams): InsertReturnType<TReturn> => {
        return new Promise((resolve) => {
            setResult(undefined);
            setError(null);
            setStatus(0)
            setCode(undefined)

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            mutate({postFn: func, data: data, params: params}, {
                onSuccess: (response) => {
                    const success = response.status === 200;
                    const data = success ? (response.data as TReturn) : undefined;

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
            });
        });
    };

    return {insert, result, error, isLoading: isPending || isPaused, isError, failureReason};
};