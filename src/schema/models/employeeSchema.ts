import {z} from "zod";
import {individualSchemaMerge, teacherIndividualExtend} from "./individualSchema.ts";
import {schoolMergeSchema} from "@/schema";
import {dateProcess, excludeSpecialCharacters} from "../commonSchema.ts";
import {IndividualType} from "@/core/shared/sharedEnums.ts";

export const employeeContractSchema = z.object({
    role: excludeSpecialCharacters({requiredError: "Le role est requis"}),
    contractType: z.string({required_error: 'Le type de contrat est requis'}).min(1, {message: "Le type de contrat est requis"}),
    salaryBasis: z.string({required_error: 'Le type de salaire est requis'}).min(1, {message: "Le type de salaire est requis"}),
    salaryByHour: z.number().optional(),
    monthlySalary: z.number().optional(),
    currency: z.string(),
    startDate: dateProcess("La date d'embauche est réquis"),
    status: z.string().default('ACTIVE'),
    bankName: z.string().optional(),
    bankAccount: z.string().optional()
        .or(z.literal(""))
        .refine((val) => !val || (val.length >= 6 && val.length <= 11), {
            message: "Le numéro de compte bancaire doit contenir entre 6 et 11 chiffres",
        }),
    mobileMoneyNumber: z
        .string()
        .optional()
        .or(z.literal("")) 
        .refine((val) => !val || /^\d{9}$/.test(val), {
            message: "Le numéro de Momo doit contenir exactement 9 chiffres (uniquement des chiffres)",
        }),
    cnssNumber: z.string().optional(),
    createdBy: individualSchemaMerge.optional(),
})

export const employeeSchema = z.object({
    personalInfo: teacherIndividualExtend.extend({
        individualType: z.number({required_error: "Le type de l'individu est requis"}).default(IndividualType.EMPLOYEE),
    }),
    school: schoolMergeSchema.optional(),
    contract: employeeContractSchema,
})