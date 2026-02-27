import {useGlobalStore} from "@/core/global/store.ts";
import {DownloadApi} from "@/data/repository/downloadApi.ts";
import {useMutation} from "@tanstack/react-query";
import {AxiosResponse} from "axios";
import {catchError} from "@/data/action/error_catch.ts";

export const useDownload = () => {
    const schoolId = useGlobalStore(state => state.schoolId)

    const useDownloadInvoice = () =>
        useMutation<AxiosResponse<Blob>, unknown, {invoiceId: number, invoiceNumber?: string}>({
            mutationFn: ({invoiceId}) =>
                DownloadApi.downloadInvoice(invoiceId, schoolId),
            onSuccess: async (response: AxiosResponse<Blob>, variables) =>
                DownloadApi.fileDownload(response, `Invoice-${variables?.invoiceNumber}`),
            onError: async (error: unknown) => catchError(error)
    })

    const useDownloadReceipt = () =>
        useMutation<AxiosResponse<Blob>, unknown, {paymentId: string, voucherNumber?: string}>({
            mutationFn: ({paymentId}) =>
                DownloadApi.downloadPayment(paymentId, schoolId),
            onSuccess: async (response: AxiosResponse<Blob>, variables) =>
                DownloadApi.fileDownload(response, `Paiement-${variables?.voucherNumber}`),
            onError: async (error: unknown) => catchError(error)
        })

    return {
        useDownloadInvoice,
        useDownloadReceipt,
    }
}