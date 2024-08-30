import {FetchFunction} from "../utils/interfaces.ts";
import {AxiosResponse} from "axios";
import {Response} from "../data/action/response.ts";

let fetchContext: FetchFunction = () => {
    throw Error("fetch function is not implemented")
}

export const setFetch = (fetchFunction: FetchFunction) => {
    fetchContext = fetchFunction
}

const fetch = <T>(callback: (...args: any[]) => Promise<AxiosResponse<T | T[]>>, params: any[] = []): Promise<Response<T | T[]>> => {
    if (fetchContext) {
        return fetchContext(callback, params)
    }
    return new Promise<Response<T | T[]>>((resolve, reject) => {
        const response = {
            isSuccess: false,
            error: '',
            success: '',
            data: []
        } as Response<T | T[]>

        if (response.isSuccess) {
            resolve(response); // Fulfill the promise with the response object.
        } else {
            reject(response); // Reject the promise with the response object.
        }
    })
}

export { fetch }