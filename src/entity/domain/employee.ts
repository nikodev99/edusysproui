import {Individual, School} from "@/entity";
import {ContractType} from "@/entity/enums/contractType.ts";
import {Moment} from "@/core/utils/interfaces.ts";

export interface Employee {
    id: string;
    personalInfo: Individual
    contract: EmployeeContract
    school: School
    createdAt: number[] | Date | string
    modifyAt: number[] | Date | string
}

export interface EmployeeContract {
    id: number
    role: JobTitle
    jobTitle: string
    contractType: ContractType
    salaryBasis: SalaryBasis
    salaryByHour: number
    monthlySalary: number
    currency: string
    startDate: Moment
    endDate: Moment
    isTrialPeriod: boolean
    trialEndDate: Moment
    status: ContractStatus
    terminationReason: string
    bankName: string
    bankAccount: string
    mobileMoneyNumber: string
    cnssNumber: string
    createdBy: Individual
    createdAt: Moment
    modifyAt: Moment
}

export enum StaffRole {
    TEACHER= 'Enseignant',
    ADMIN = 'Administrateur',
    SUPPORT = 'Support',
    ACCOUNTANT = 'Comptable',
}

export enum SalaryBasisEnum {
    MONTHLY = "Mensuel",
    HOURLY = "Horaire",
    PER_COURSE = "Par cours"
}

export enum ContractStatusEnum {
    ACTIVE= 'Actif',
    SUSPENDED = 'Suspendu',
    TERMINATED = 'Terminé',
    EXPIRED = 'Expiré',
    SUPERSEDED = ''
}

export type JobTitle = keyof typeof StaffRole
export type SalaryBasis = keyof typeof SalaryBasisEnum
export type ContractStatus = keyof typeof ContractStatusEnum