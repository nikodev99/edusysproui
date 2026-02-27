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
    },

    fileDownload: (response: AxiosResponse<Blob>, fallbackName = 'download', exp: string = 'pdf') => {
        const blob = response.data;

        const contentDisposition =
            response.headers['content-disposition'] ||
            response.headers['Content-Disposition'];

        let filename = `${fallbackName}.${exp}`;

        if (contentDisposition) {
            const match =
                /filename\*?=(?:UTF-8'')?["']?([^;"']+)/i.exec(contentDisposition);
            if (match?.[1]) {
                filename = decodeURIComponent(match[1].replace(/(^"|"$)/g, ''));
            }
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    }
}