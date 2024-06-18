import {z} from "zod";

export const healthSchema = z.object({
    bloodType: z.union([
        z.number(),
        z.string().min(1, {message: "Ajouter le groupe sanguin de l'étudiant est requis"})
    ]),
    weight: z.number(),
    height: z.number(),
    handicap: z.string().optional(),
    medicalConditions: z.array(z.string()).optional(),
    allergies: z.array(z.string()).optional(),
    medications: z.array(z.string()).optional()
})