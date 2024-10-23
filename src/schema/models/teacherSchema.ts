import {z} from "zod";
import dayjs from "dayjs";
import {addressSchema} from "./addressSchema.ts";
import {schoolSchema} from "./schoolSchema.ts";
import {courseSchema} from "./courseSchema.ts";
import {classeSchema} from "./classeSchema.ts";

export const teacherSchema = z.object({
    firstName: z.string({required_error: 'Prénom(s) est réquis'})
        .min(3, {message: "Prénom doit contenir au moins trois caractères"})
        .regex(/^[a-zA-Z-\s]+$/, {message: 'Le prénom doit contenir uniquement des lettres, des tirets et des espaces'}),
    lastName: z.string({required_error: 'Nom(s) est réquis'})
        .min(3, {message: "Nom de famille doit contenir au moins trois caractères"})
        .regex(/^[a-zA-Z-\s]+$/, {message: 'Le Nom de famille doit contenir uniquement des lettres, des tirets et des espaces'}),
    maidenName: z.string().nullable().optional(),
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
    cityOfBirth: z.string().min(1, {message: "Ville est requis"}),
    nationality: z.string({required_error: "La nationalité est requise"}),
    gender: z.union([z.string({required_error: "Le genre est requis"}), z.number({required_error: "Le genre est requis"})]),
    address: addressSchema,
    emailId: z.string().min(1, {message: 'Email est requis'}).email({message: 'Email non conforme'}),
    telephone: z.string()
        .min(1, {message: 'Le numéro de téléphone est requis'})
        .length(9, {message: 'Entrer un numéro de téléphone valide avec 9 chiffres'}),
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
    image: z.string().optional(),
    attachments: z.array(z.string()).optional(),
    school: schoolSchema.optional(),
})