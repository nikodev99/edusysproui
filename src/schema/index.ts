import {z} from "zod";

export const inscriptionSchema = z.object({
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
    birthCity: z.string().min(1, {message: "Ville est requis"}),
    nationality: z.string().min(1, {message: "Nationalité est requis"}),
    dadName: z.string().min(1, {message: "Nom et prénom du père est requis"}),
    momName: z.string().min(1, {message: "Nom et prénom de la mère est requis"}),
    telephone: z.string().optional(),
})