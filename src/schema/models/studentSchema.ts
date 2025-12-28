import {z} from "zod";
import {guardianSchema, healthSchema, individualSchema} from "@/schema";
import {dateProcess} from "../commonSchema.ts";
import {IndividualType} from "@/core/shared/sharedEnums.ts";

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
    id: z.string({required_error: 'Etudiant est requis'}).min(3, {message: "Etudiant est requis"}),
})