import {apiClient} from "@/data/axiosConfig.ts";
import {AxiosResponse} from "axios";

export const DownloadApi =  {
    downloadInvoice: (invoiceId: number, schoolId: string): Promise<AxiosResponse<Blob>> => {
        return apiClient.get(`/download/invoice/${invoiceId}/${schoolId}`, {
            responseType: 'blob'
        })
    },

    downloadPayment: (paymentId: string, schoolId: string): Promise<AxiosResponse<Blob>> => {
        return apiClient.get(`/download/payment/${paymentId}/${schoolId}`, {
            responseType: 'blob'
        })
    }
}