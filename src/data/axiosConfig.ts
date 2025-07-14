import axios, {AxiosError, AxiosResponse} from "axios";
import {AxiosConfig} from "../core/utils/interfaces.ts";
import {message} from "antd";
import {redirectTo} from "../context/RedirectContext.ts";
import {loggedUser} from "../auth/jwt/LoggedUser.ts";

const baseURL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
    baseURL: baseURL,
    // You can add other default configurations here
    // headers: { 'Content-Type': 'application/json' },
    // timeout: 10000,
})

apiClient.interceptors.request.use(config => {
    const token = loggedUser.getToken();
    if (token) config.headers!['Authorization'] = `Bearer ${token}`;
    return config;
})

/*apiClient.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        const { response, config } = error;
        if (response?.status === 401 && config) {
            try {
                const didRefresh = await tokenRefresh();
                if (didRefresh) {
                    const token = loggedUser.getToken();

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    config.headers = {
                        ...config.headers,
                        Authorization: `Bearer ${token}`,
                    };
                    return apiClient.request(config);
                }
            } catch (refreshErr) {
                handleError(refreshErr);
            }
        }
        // if we get here, either it wasn’t a 401 or refresh failed
        loggedUser.removeToken();
    }
);*/

const request = ({method, url, data, headers, params}: AxiosConfig) => {
    return apiClient({
        method: method,
        url: `${baseURL}${url}`,
        params: params,
        data: data,
        headers: headers
    })
}

const isAxiosError = (err: unknown): err is AxiosError => {
    return axios.isAxiosError(err)
}

const handleError = (err: unknown) => {
    if (isAxiosError(err)) {
        const errResp = err.response as AxiosResponse
        if (Array.isArray(errResp?.data?.errors)) {
            errResp?.data.errors.forEach((error: object) => {
                message.warning(`${'description' in error ? error?.description : ""}`, 5).then()
            })
        }else if (typeof errResp?.data.errors === 'object') {
            Object.values(errResp?.data.errors).forEach((error) => {
                message.warning(`${error}`, 5).then()
            })
        }else if (errResp?.data) {
            message.warning(`${errResp?.data}`, 5).then()
        }else if (errResp?.status === 401) {
            message.error("Veuillez vous connecter s'il vous plait...", 5)
                .then(() => redirectTo('login'))
        }else if (errResp) {
            message.error(`${errResp?.data}`, 5).then()
        }
    }
}

export {apiClient, request, isAxiosError, handleError}
