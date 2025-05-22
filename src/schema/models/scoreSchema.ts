import {z} from "zod";
import {studentSchemaMerge} from "./studentSchema.ts";
import {assignmentMerge} from "./assignmentSchema.ts";

export const singleScoreSchema = z.object({
    id: z.number().optional(),
    assignment: assignmentMerge.optional(),
    student: studentSchemaMerge,
    obtainedMark: z.coerce.number({required_error: 'La note obtenue est requise'})
        .min(0, 'La note ne peut pas être inférieure à 0')
        .max(20, 'La note ne peut pas être supérieur 20'),
    isPresent: z.boolean()
})

export const scoreSchema = z.object({
    scores: z.array(singleScoreSchema)
})