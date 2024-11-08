import {z} from "zod";
import dayjs from "dayjs";
import {schoolSchema} from "./schoolSchema.ts";
import {courseSchema} from "./courseSchema.ts";
import {classeSchema} from "./classeSchema.ts";
import {individualSchema} from "./individualSchema.ts";

export const teacherSchema = z.object({
    personalInfo: individualSchema.extend({
        status: z.union([z.string({required_error: "Le status est requis"}), z.number({required_error: "Le status est requis"})]),
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
        emailId: z.string().min(1, {message: 'Email est requis'}).email({message: 'Email non conforme'}),
        telephone: z.string()
            .min(1, {message: 'Le numéro de téléphone est requis'})
            .length(9, {message: 'Entrer un numéro de téléphone valide avec 9 chiffres'}),
    }),
    hireDate: z.preprocess(
        (arg) => {
            if (dayjs.isDayjs(arg)) {
                return arg.toDate()
            }
            if (typeof arg === "string" || arg instanceof Date) {
                const date = dayjs(arg);
                return date.isValid() ? date.toDate() : undefined
            }
            return undefined
        }, z.date().refine(date => !isNaN(date.getTime()), {message: 'Date invalide'})
    ).optional(),
    courses: z.array(courseSchema).optional(),
    classes: z.array(classeSchema, {required_error: "La(es) classe(s) de l'enseignants est (sont) requis"}),
    salaryByHour: z.number(),
    school: schoolSchema.optional(),
})