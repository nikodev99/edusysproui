import {apiClient} from "@/data/axiosConfig.ts";
import {PaymentHistory, PaymentSchema, PaymentSummary, PaymentResponse} from "@/finance/models/payment.ts";
import {Invoice} from "@/finance/models/invoice.ts";

export const GuardianPayment = {
    getPaymentSummary: (guardianId: string, academicYear: string) => {
        return apiClient.get<PaymentSummary>(`/guardian/payment/summary/${guardianId}`, {
            params: {
                academicYear: academicYear
            }
        })
    },

    getAllGuardianInvoices: (guardianId: string, schoolId: string) => {
        return apiClient.get<Invoice[]>(`/guardian/payment/invoices_all/${guardianId}/${schoolId}`)
    },

    getGuardianCurrentInvoices: (guardianId: string, academicYear: string) => {
        return apiClient.get<Invoice[]>(`/guardian/payment/invoices_current/${guardianId}`, {
            params: {
                academicYear: academicYear
            }
        })
    },

    getGuardianActiveInvoice: (guardianId: string, academicYear: string) => {
        return apiClient.get<Invoice[]>(`/guardian/payment/active_invoice/${guardianId}`, {
            params: {
                academicYear: academicYear
            }
        })
    },

    getGuardianPaymentHistory: (guardianId: string, academicYear: string) => {
        return apiClient.get<PaymentHistory[]>(`/guardian/payment/history/${guardianId}`, {
            params: {
                academicYear: academicYear
            }
        })
    },

    initPayment: (data: PaymentSchema) => {
        return apiClient.post<PaymentResponse>(`/guardian/payment/initiate`, data)
    }
}