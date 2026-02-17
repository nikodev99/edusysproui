import {Moment} from "@/core/utils/interfaces.ts";
import {Enrollment, Guardian, Individual} from "@/entity";
import {Invoice} from "@/finance/models/invoice.ts";
import {z} from "zod";

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

export const paymentSchema = z.object({
    student: z.number(),
    invoice: z.number(),
    paymentMethod: z.number(),
    amountPaid: z.number(),
    currency: z.string(),
    transactionId: z.string().optional(),
    paymentGateway: z.number(),
    processedBy: z.number(),
    notes: z.string(),
    schoolId: z.string().optional(),
})

export const mobileMoneyPayment = z.object({
    phoneNumber: z.string(),
    amountPaid: z.number(),
    currency: z.string().default('XAF'),
    notes: z.string(),
})

export const bankPayment = z.object({
    cardNumber: z.string(),
    cardCCV: z.string(),
    cardHolder: z.string(),
    cardExpiry: z.string(),
    amountPaid: z.number(),
})

export interface PaymentResponseMessage {
    paymentId: string;
    data: unknown;
    status: string;
    message: string;
    success: boolean;
}

export interface PaymentResponse {
    paymentId: string
    voucherNumber: string
    paymentGatewayUrl: string
    transactionReference: string
    message: string
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

export type PaymentSchema = z.infer<typeof paymentSchema>
export type MobileMobilePayment = z.infer<typeof mobileMoneyPayment>
export type CreditCardPayment = z.infer<typeof bankPayment>
