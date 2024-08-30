import {createContext, FC, ReactNode, useEffect} from "react";
import {FetchFunction} from "../utils/interfaces.ts";
import {customFetch} from "../hooks/useFetch.ts";
import {setFetch} from "../context/FetchContext.ts";
import {AxiosResponse} from "axios";

const FetchProviderContext = createContext<FetchFunction | undefined>(undefined)

/* eslint-disable @typescript-eslint/no-explicit-any */
const useFetchFunction = () => {
    return <T, >(callback: (...args: any[]) => Promise<AxiosResponse<T | T[]>>, params: any[] = []) => {
        return customFetch(callback, params);
    };
};

const FetchProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const fetch = useFetchFunction()

    useEffect(() => {
        setFetch(fetch)
    }, [fetch]);

    return(
        <FetchProviderContext.Provider value={undefined}>
            {children}
        </FetchProviderContext.Provider>
    )
}

export default FetchProvider