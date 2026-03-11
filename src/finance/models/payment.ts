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
    notes: z.string().optional(),
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
    overdueInvoices: number,
    countStudent: number
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

export const GATEWAY_META = {
    [PaymentGateway.MTN_MOMO]: { label: "MTN MoMo",     color: "#92400e", bg: "#fef3c7" },
    [PaymentGateway.AIRTEL_MOMO]: { label: "Airtel Money", color: "#991b1b", bg: "#fee2e2" },
    [PaymentGateway.STRIPE]: { label: "Visa",       color: "#3730a3", bg: "#e0e7ff" },
};

export enum PaymentStatus {
    PENDING,
    COMPLETED,
    FAILED,
    REFUNDED,
    CANCELLED
}

export const STATUS_META = {
    [PaymentStatus.COMPLETED]: { label: "Complété",   bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
    [PaymentStatus.PENDING]:   { label: "En attente", bg: "#fef9c3", color: "#78350f", dot: "#f59e0b" },
    [PaymentStatus.FAILED]:    { label: "Échoué",     bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
    [PaymentStatus.REFUNDED]:  { label: "Remboursé",  bg: "#e0e7ff", color: "#3730a3", dot: "#6366f1" },
    [PaymentStatus.CANCELLED]: { label: "Annulé",     bg: "#f3f4f6", color: "#374151", dot: "#6b7280" },
};

export type PaymentSchema = z.infer<typeof paymentSchema>
export type MobileMobilePayment = z.infer<typeof mobileMoneyPayment>
export type CreditCardPayment = z.infer<typeof bankPayment>
