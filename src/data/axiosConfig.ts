import axios, {AxiosError} from "axios";
import {AxiosConfig} from "../core/utils/interfaces.ts";

const baseURL = import.meta.env.VITE_API_URL;

export const apiRequest = axios.create()

export const apiClient = axios.create({
    baseURL: baseURL,
    // You can add other default configurations here
    // headers: { 'Content-Type': 'application/json' },
    // timeout: 10000,
})

export const request = ({method, url, data, headers, params}: AxiosConfig) => {
    return axios({
        method: method,
        url: `${baseURL}${url}`,
        params: params,
        data: data,
        headers: headers
    })
}

export const isAxiosError = (err: unknown): err is AxiosError => {
    return axios.isAxiosError(err)
}
