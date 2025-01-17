import {z} from "zod";
import {departmentSchemaMerge} from "./departmentSchema.ts";

export const courseSchema = z.object({
    course: z.string({required_error: 'Le nom de la matière est requis'}).min(3, {
        message: "Le nom d'une matière doit contenir au moins trois characters"
    }),
    abbr: z.string({required_error: "L'abréviation est réquise"}).min(1, {message: "L'abréviation est réquise"}),
    department: departmentSchemaMerge
})

export const courseSchemaMerge = z.object({
    id: z.number().optional(),
})