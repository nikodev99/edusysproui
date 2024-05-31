import axios from "axios";
import {AxiosConfig} from "../utils/interfaces.ts";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    // You can add other default configurations here
    // headers: { 'Content-Type': 'application/json' },
    // timeout: 10000,
})

export const request = ({method, url, data, headers}: AxiosConfig) => {
    return axios({
        method: method,
        url: url,
        data: data,
        headers: headers
    })
}
