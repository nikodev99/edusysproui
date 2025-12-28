import {z} from "zod";
import {addressSchema} from "@/schema";
import {dateProcess, utf8characterDigitExcluded} from "@/schema/commonSchema.ts";

export const individualSchema = z.object({
    firstName: utf8characterDigitExcluded({
        requiredError: 'Prénom(s) est réquis',
        regexError: 'Le prénom doit contenir uniquement des lettres, des tirets et des espaces',
    }).min(3, {message: "Prénom doit contenir au moins trois caractères"}),
    lastName: utf8characterDigitExcluded({
        requiredError: 'Nom(s) est réquis',
        regexError: 'Le Nom de famille doit contenir uniquement des lettres, des tirets et des espaces'
    }).min(3, {message: "Nom de famille doit contenir au moins trois caractères"}),
    maidenName: z.string().nullable().optional(),
    gender: z.union([z.string({required_error: "Le genre est requis"}), z.number({required_error: "Le genre est requis"})]),
    status: z.string().optional(),
    emailId: z.union([
        z.string().length(0),
        z.string().email({
            message: 'Entrer un email valid'
        })
    ]).nullable().optional(),
    reference: z.string().nullable().optional(),
    birthDate: z.string().nullable().optional(),
    birthCity: z.string().nullable().optional(),
    nationality: z.string().nullable().optional(),
    telephone: z.string().nullable().optional(),
    mobile: z.string().nullable().optional(),
    address: z.lazy(() => addressSchema),
    image: z.string().nullable().optional(),
    attachments: z.array(z.string()).nullable().optional(),
    individualType: z.union([
        z.string({required_error: "Le type de l'individu est requis"}),
        z.number({required_error: "Le type de l'individu est requis"})
    ])
})

export const teacherIndividualExtend = individualSchema.extend({
    status: z.union([z.string({required_error: "Le status est requis"}), z.number({required_error: "Le status est requis"})]),
    birthDate: dateProcess('La date de naissance est requise', {before: true}),
    birthCity: z.string().min(1, {message: "Ville est requise"}),
    nationality: z.string().min(1, {message: "Nationalité est requise"}),
    emailId: z.string().min(1, {message: 'Email est requis'}).email({message: 'Email non conforme'}),
    telephone: z.string()
        .min(1, {message: 'Le numéro de téléphone est requis'})
        .length(9, {message: 'Entrer un numéro de téléphone valide avec 9 chiffres'}),
})

export const individualSchemaMerge = z.object({
    id: z.number({required_error: "Professeur est requis"}),
})