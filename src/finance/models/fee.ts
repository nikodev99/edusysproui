import {Account} from "@/finance/models/accounting.ts";

export interface FeeCategories {
    id: number,
    name: string
    category_code: string
    description: string
    isMandatory: boolean
    isActive: boolean
    accountCode: Account
}