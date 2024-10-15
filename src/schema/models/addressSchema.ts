import {z} from "zod";

export const addressSchema = z.object({
    id: z.number().optional(),
    number: z.number().positive({message: 'Veuillez entrer exclusivement des nombres positive'}),
    street: z.string().min(1, {message: "Rue est requis"}),
    secondStreet: z.string().optional(),
    neighborhood: z.string().min(1, {message: "Quartier est requis"}),
    borough: z.string().optional(),
    city: z.string().min(1, {message: "Ville est requise"}),
    zipCode: z.string().optional(),
    country: z.string({required_error: "Pays est requis"}).min(1, {message: "Pays est requis"}),
})