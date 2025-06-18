import {z} from "zod";
import {schoolSchema} from "./schoolSchema.ts";

export const academicYearSchema = z.object({
    id: z.string().optional(),
    startDate: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().refine((date) => !isNaN(date.getTime()), {message: "Date invalide"})
    ),
    endDate: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().refine((date) => !isNaN(date.getTime()), {message: "Date invalide"})
    ),
    school: schoolSchema.optional()
})

export const academicYearSchemaMerge = z.object({
    id: z.string()
})