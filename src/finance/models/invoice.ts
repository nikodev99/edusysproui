import {Enrollment, Guardian, Individual} from "@/entity";
import {Moment} from "@/core/utils/interfaces.ts";
import {FeeCategories} from "@/finance/models/fee.ts";

export interface Invoice {
    invoiceId: number
    enrollmentId: number
    enrolledStudent: Enrollment
    guardian: Guardian
    invoiceDate: Moment
    dueDate: Moment
    invoiceNumber: string
    subTotalAmount: number
    discount: number
    taxAmount: number
    amountPaid: number
    totalAmount: number
    balanceDue: number
    status: InvoiceStatus
    isOverdue: boolean
    items: InvoiceItem[]
    issueBy: Individual
    notes: string
}

export interface InvoiceItem {
    id: number
    category: FeeCategories
    description: string
    quantity: number
    unitPrice: number
    discountPercentage: number
    discountAmount: number
    totalAmount: number
}

export enum InvoiceStatus {
    DRAFT,
    SENT,
    PARTIALLY_PAID,
    PAID,
    OVERDUE,
    CANCELLED
}

export type StatusInput = InvoiceStatus | number | string;
