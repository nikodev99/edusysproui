import {z} from "zod";
import {guardianSchema} from "./guardianSchema.ts";
import {healthSchema} from "./healthSchema.ts";
import {individualSchema} from "./individualSchema.ts";
import dayjs from "dayjs";

export const studentSchema = z.object({
    personalInfo: individualSchema.extend({
        birthDate: z.preprocess(
            (arg) => {
                if (dayjs.isDayjs(arg)) {
                    return arg.toDate()
                }
                if (typeof arg === "string" || arg instanceof Date) {
                    const date = dayjs(arg);
                    return date.isValid() ? date.toDate() : undefined
                }
                return undefined
            }, z.date({required_error: 'La date de naissance est requise'}).refine(date => !!date, {message: 'Date invalid'})
        ),
        birthCity: z.string().min(1, {message: "Ville est requise"}),
        nationality: z.string().min(1, {message: "Nationalité est requise"}),
    }),
    dadName: z.string().min(1, {message: "Nom et prénom du père est requis"}),
    momName: z.string().min(1, {message: "Nom et prénom de la mère est requis"}),
    guardian: guardianSchema,
    healthCondition: healthSchema,
    reference: z.string().optional(),
})