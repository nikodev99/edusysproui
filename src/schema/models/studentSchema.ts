import {z} from "zod";
import {academicYearSchemaMerge, classeSchemaMerge, guardianSchema, healthSchema, individualSchema} from "@/schema";
import {dateProcess} from "../commonSchema.ts";
import {IndividualType} from "@/core/shared/sharedEnums.ts";
import Datetime, {DateFormat} from "@/core/datetime.ts";

export const studentSchema = z.object({
    personalInfo: individualSchema.extend({
        birthDate: dateProcess('La date de naissance est requise'),
        birthCity: z.string().min(1, {message: "Ville est requise"}),
        nationality: z.string().min(1, {message: "Nationalité est requise"}),
        individualType: z.number({required_error: "Le type de l'individu est requis"}).default(IndividualType.STUDENT),
    }),
    dadName: z.string().min(1, {message: "Nom et prénom du père est requis"}),
    momName: z.string().min(1, {message: "Nom et prénom de la mère est requis"}),
    guardian: guardianSchema,
    healthCondition: z.lazy(() => healthSchema),
    reference: z.string().optional(),
})

export const studentSchemaMerge = z.object({
    id: z.string({required_error: 'Étudiant est requis'}).min(3, {message: "Etudiant est requis"}),
})

export const studentBossSchema = z.object({
    academicYear: academicYearSchemaMerge,
    classe: classeSchemaMerge,
    principalStudent: studentSchemaMerge,
    current: z.boolean().default(true),
    startPeriod: dateProcess("").optional().default(Datetime.now().format(DateFormat.ISO_DATE))
})