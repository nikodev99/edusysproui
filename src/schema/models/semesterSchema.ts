import {z} from "zod";
import {academicYearSchema} from "./academicYearSchema.ts";

export const semesterSchema = z.object({
    semesterId: z.number().optional(),
    semesterName: z.string(),
    academicYear: academicYearSchema.optional(),
    description: z.string()
})

export const semesterSchemaMerge = z.object({
    id: z.number({required_error: 'Le semestre est requis'}),
})