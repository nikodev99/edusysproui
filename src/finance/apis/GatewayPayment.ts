import {apiClient} from "@/data/axiosConfig.ts";
import {CreditCardPayment, MobileMobilePayment, PaymentResponseMessage} from "@/finance/models/payment.ts";

export const GatewayPayment = {
    mtnPayment: (request: MobileMobilePayment) => {
        return apiClient.post<PaymentResponseMessage>(`/gateway/mtn-momo`, request)
    },

    airtelPayment: (request: MobileMobilePayment) => {
        return apiClient.post<PaymentResponseMessage>(`/gateway/airtel-momo`, request)
    },

    bankPayment: (request: CreditCardPayment) => {
        return apiClient.post<PaymentResponseMessage>(`/gateway/credit-card`, request)
    }
}