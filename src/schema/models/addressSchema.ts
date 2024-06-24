import {z} from "zod";

export const addressSchema = z.object({
    id: z.number().optional(),
    number: z.number(),
    street: z.string().min(1, {message: "Rue est requis"}),
    secondStreet: z.string().optional(),
    neighborhood: z.string(),
    borough: z.string().optional(),
    city: z.string(),
    zipCode: z.string().optional(),
    country: z.string(),
})