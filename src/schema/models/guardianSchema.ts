import {z} from "zod";
import {addressSchema} from "./addressSchema.ts";

export const guardianSchema = z.object({
    lastName: z.string().min(1, {message: 'Nom de famille est requis'}),
    firstName: z.string().min(1, {message: 'Prénom est requis'}),
    gender: z.union([z.string(), z.number()]),
    status: z.union([z.string(), z.number()]),
    maidenName: z.string().optional(),
    emailId: z.union([
        z.string().length(0),
        z.string().email({
            message: 'Entrer un email valid'
        })
    ]).optional().transform(e => e === "" ? undefined : e),
    company: z.string().optional(),
    jobTitle: z.string().optional(),
    telephone: z.string().length(9, {message: 'Entrer une numéro de téléphone valid avec 9 chiffres'}),
    mobile: z.string().optional(),
    address: addressSchema.optional()
})