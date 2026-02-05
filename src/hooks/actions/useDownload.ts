import {useGlobalStore} from "@/core/global/store.ts";
import {DownloadApi} from "@/data/repository/downloadApi.ts";
import {useMutation} from "@tanstack/react-query";
import {AxiosResponse} from "axios";
import {catchError} from "@/data/action/error_catch.ts";

export const useDownload = () => {
    const schoolId = useGlobalStore(state => state.schoolId)

    const useDownloadInvoice = () => useMutation<AxiosResponse<Blob>, unknown, {invoiceId: number}>({
        mutationFn: ({invoiceId}) => DownloadApi.downloadInvoice(invoiceId, schoolId),
        onSuccess: async (response: AxiosResponse<Blob>, variables) => {
            const blob = response.data;

            const contentDisposition =
                response.headers['content-disposition'] ||
                response.headers['Content-Disposition'];

            let filename = `invoice-${variables.invoiceId}.pdf`;

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
        },
        onError: async (error: unknown) => {
            catchError(error);
        }
    })

    return {
        useDownloadInvoice,
    }
}