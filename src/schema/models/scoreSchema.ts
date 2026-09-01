import {z} from "zod";
import {studentSchemaMerge, assignmentMerge} from "@/schema";

export const singleScoreSchema = z.object({
    id: z.number().optional(),
    assignment: assignmentMerge.optional(),
    student: studentSchemaMerge,
    obtainedMark: z.coerce.number({required_error: 'La note obtenue est requise'})
        .min(0, 'La note ne peut pas être inférieure à 0')
        .max(20, 'La note ne peut pas être supérieur 20'),
    isPresent: z.preprocess(arg => Number(arg) === 1, z.boolean())
}).refine(arg => {
    console.log({arg})
    return arg.isPresent || arg.obtainedMark === 0
}, {message: 'La note doit être 0 si l\'élève est absent', path: ['obtainedMark']})

export const scoreSchema = z.object({
    scores: z.array(singleScoreSchema)
})