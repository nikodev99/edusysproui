import {z} from "zod";

const addressSchema = z.object({
    number: z.number(),
    street: z.string().min(1, {message: "Rue est requis"}),
    secondStreet: z.string().optional(),
    neighborhood: z.string(),
    borough: z.string().optional(),
    city: z.string(),
    zipCode: z.string().optional(),
    country: z.string(),
})

export const classeSchema = z.object({
    id: z.number()
})

export const enrollmentSchema = z.object({
    academicYear: z.string().min(1, {message: "L'année scolaire est requise"}),
    classe: classeSchema
})

export const studentSchema = z.object({
    lastName: z.string().min(3, {message: "Nom de famille est requis"}),
    firstName: z.string().min(1, {message: "Prénom est requis"}),
    gender: z.union([z.string(), z.number()]),
    emailId: z.union([
        z.string().length(0),
        z.string().email({
            message: 'Entrer un email valid'
        })
    ]).optional().transform(e => e === "" ? undefined : e),
    birthDate: z.preprocess(
        (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined),
        z.date().refine((date) => !isNaN(date.getTime()), { message: "Date invalide" }),
    ),
    birthCity: z.string().min(1, {message: "Ville est requise"}),
    nationality: z.string().min(1, {message: "Nationalité est requise"}),
    dadName: z.string().min(1, {message: "Nom et prénom du père est requis"}),
    momName: z.string().min(1, {message: "Nom et prénom de la mère est requis"}),
    telephone: z.string().optional(),
    address: addressSchema,
    enrollment: z.array(enrollmentSchema)
})