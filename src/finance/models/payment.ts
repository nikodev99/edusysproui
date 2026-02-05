import {Moment} from "@/core/utils/interfaces.ts";
import {Enrollment, Guardian, Individual} from "@/entity";
import {Invoice} from "@/finance/models/invoice.ts";

export interface PaymentHistory {
    paymentId: string
    voucherNumber: string
    receiptNumber: string
    paymentDate: Moment
    enrolledStudent: Enrollment
    guardian: Guardian
    invoice: Invoice
    amountPaid: number
    currency: string
    transactionId: string
    paymentGateway: PaymentGateway
    paymentMethod: PaymentMethod
    status: PaymentStatus
    processedBy: Individual
    createBy: Individual
    notes: string
    createdAt: Moment
}

export interface PaymentSummary {
    totalOutstanding: number,
    totalPaidThisYear: number,
    overdueInvoices: number
}

export enum PaymentGateway {
    STRIPE,
    MTN_MOMO,
    AIRTEL_MOMO
}

export enum PaymentMethod {
    CASH,
    BANK_CARD,
    MOBILE_MONEY,
    BANK_TRANSFER
}

export enum PaymentStatus {
    PENDING,
    COMPLETED,
    FAILED,
    REFUNDED,
    CANCELLED
}
