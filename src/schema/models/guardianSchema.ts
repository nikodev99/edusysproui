import {z} from "zod";
import {individualSchema} from "./individualSchema.ts";
import {IndividualType} from "../../core/shared/sharedEnums.ts";

export const guardianSchema = z.object({
    id: z.string().optional(),
    personalInfo: individualSchema.extend({
        status: z.union([z.string({required_error: "Le status est requis"}), z.number({required_error: "Le status est requis"})]),
        telephone: z.string().length(9, {
            message: 'Entrer une numéro de téléphone valide avec 9 chiffres'
        }),
        individualType: z.number({required_error: "Le type de l'individu est requis"}).default(IndividualType.GUARDIAN),
    }),
    company: z.string().optional(),
    jobTitle: z.string().optional(),
})