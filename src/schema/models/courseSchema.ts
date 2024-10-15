import {z} from "zod";

export const courseSchema = z.object({
    id: z.number(),
})