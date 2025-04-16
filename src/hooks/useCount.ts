import {useCallback, useEffect, useMemo, useState} from "react";
import {AxiosResponse} from "axios";
import {useRawFetch} from "./useFetch.ts";

export const useCount = <T extends object>(
    func: (...args: unknown[]) => Promise<AxiosResponse<T, unknown>>,
    params?: unknown[],
    hasNoParam: boolean = false
): T | undefined => {
    const [count, setCount] = useState<T>();
    const rawFetch = useRawFetch();
    
    const customParams = useMemo(() => params, [params]);
    const customFetch = useCallback(() => {
        return hasNoParam ? rawFetch(func, []) : rawFetch(func, customParams);
    }, [customParams, func, hasNoParam, rawFetch])

    useEffect(() => {
        if ((params && params?.length > 0) || hasNoParam) {
            customFetch()
                .then(resp => {
                    if (resp.isSuccess) {
                        setCount(resp.data as T);
                    }
                });
        }
    }, [customFetch, hasNoParam, params]);

    return count;
}
