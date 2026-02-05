import {Individual, School} from "@/entity";
import {Moment} from "@/core/utils/interfaces.ts";

export interface Account {
    id: number,
    school: School,
    accountCode: string
    accountName: string
    accountClass: number
    parentAccountCode: ParentAccount
    accountType: AccountType
    isActive: boolean
    isSystemAccount: boolean
    createdBy: Individual
    createdAt: Moment
}

export enum ParentAccount {
    CLASS_4,
    CLASS_5,
    CLASS_6,
    CLASS_7,
    CLASS_8,
    CLASS_9
}

export enum AccountType {
    ASSET,
    LIABILITY,
    EQUITY,
    INCOME,
    EXPENSE
}

export const AccountClass: Record<
    ParentAccount,
    {
        code: number
        parentCode: number
        label: string
    }
> = {
    [ParentAccount.CLASS_4]: {
        code: 4,
        parentCode: 410,
        label: "Third-party / Receivables"
    },
    [ParentAccount.CLASS_5]: {
        code: 5,
        parentCode: 500,
        label: "Cash & Bank"
    },
    [ParentAccount.CLASS_6]: {
        code: 6,
        parentCode: 600,
        label: "Expenses"
    },
    [ParentAccount.CLASS_7]: {
        code: 7,
        parentCode: 700,
        label: "Revenue (tuition & related)"
    },
    [ParentAccount.CLASS_8]: {
        code: 8,
        parentCode: 800,
        label: "Equity & Provisions"
    },
    [ParentAccount.CLASS_9]: {
        code: 9,
        parentCode: 900,
        label: "Off-balance / Special"
    }
}
