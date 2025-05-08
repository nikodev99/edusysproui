import {z} from "zod";
import {addressSchema} from "./addressSchema.ts";

export const individualSchema = z.object({
    firstName: z.string({required_error: 'Prénom(s) est réquis'})
        .min(3, {message: "Prénom doit contenir au moins trois caractères"})
        .regex(/^[a-zA-Zéèàîïùêâûòô\s-]+$/, {message: 'Le prénom doit contenir uniquement des lettres, des tirets et des espaces'}),
    lastName: z.string({required_error: 'Nom(s) est réquis'})
        .min(3, {message: "Nom de famille doit contenir au moins trois caractères"})
        .regex(/^[a-zA-Zéèàîïùêâûòô\s-]+$/, {message: 'Le Nom de famille doit contenir uniquement des lettres, des tirets et des espaces'}),
    maidenName: z.string().nullable().optional(),
    gender: z.union([z.string({required_error: "Le genre est requis"}), z.number({required_error: "Le genre est requis"})]),
    status: z.string().optional(),
    emailId: z.union([
        z.string().length(0),
        z.string().email({
            message: 'Entrer un email valid'
        })
    ]).nullable().optional(),
    birthDate: z.string().nullable().optional(),
    birthCity: z.string().nullable().optional(),
    nationality: z.string().nullable().optional(),
    telephone: z.string().nullable().optional(),
    mobile: z.string().nullable().optional(),
    address: addressSchema,
    image: z.string().nullable().optional(),
    attachments: z.array(z.string()).nullable().optional(),
})

export const individualSchemaMerge = z.object({
    id: z.number({required_error: "Professeur est requis est requis"}),
})