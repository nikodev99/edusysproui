import {z} from "zod";

export const examTypeSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    description: z.string()
})