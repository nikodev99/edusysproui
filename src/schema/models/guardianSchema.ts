import {z} from "zod";
import {individualSchema} from "./individualSchema.ts";

export const guardianSchema = z.object({
    id: z.string().optional(),
    personalInfo: individualSchema.extend({
        status: z.union([z.string({required_error: "Le status est requis"}), z.number({required_error: "Le status est requis"})]),
        telephone: z.string().length(9, {
            message: 'Entrer une numéro de téléphone valide avec 9 chiffres'
        })
    }),
    company: z.string().optional(),
    jobTitle: z.string().optional(),
})