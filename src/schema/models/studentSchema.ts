import {z} from "zod";
import {guardianSchema} from "./guardianSchema.ts";
import {healthSchema} from "./healthSchema.ts";
import {individualSchema} from "./individualSchema.ts";
import {dateProcess} from "../dateSchema.ts";

export const studentSchema = z.object({
    personalInfo: individualSchema.extend({
        birthDate: dateProcess('La date de naissance est requise'),
        birthCity: z.string().min(1, {message: "Ville est requise"}),
        nationality: z.string().min(1, {message: "Nationalité est requise"}),
    }),
    dadName: z.string().min(1, {message: "Nom et prénom du père est requis"}),
    momName: z.string().min(1, {message: "Nom et prénom de la mère est requis"}),
    guardian: guardianSchema,
    healthCondition: healthSchema,
    reference: z.string().optional(),
})

export const studentSchemaMerge = z.object({
    id: z.string({required_error: 'Le student est requis'}).min(3, {message: "Le student est requis"}),
})