import {z} from "zod";

export const healthSchema = z.object({
    bloodType: z.union([
        z.number().min(1, {message: "Ajouter le groupe sanguin de l'étudiant est requis"}),
        z.string().min(1, {message: "Ajouter le groupe sanguin de l'étudiant est requis"})
    ]),
    weight: z.number().min(5, {message: 'Le poids est requis'}),
    height: z.number().min(10, {message: 'La taille est requise'}),
    handicap: z.string().optional(),
    medicalConditions: z.array(z.string()).optional(),
    allergies: z.array(z.string()).optional(),
    medications: z.array(z.string()).optional()
})