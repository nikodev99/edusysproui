import {z} from "zod";
import {departmentSchemaMerge} from "@/schema";

export const courseSchema = z.object({
    course: z.string({required_error: 'Le nom de la matière est requis'}).min(3, {
        message: "Le nom d'une matière doit contenir au moins trois characters"
    }),
    abbr: z.string({required_error: "L'abréviation est réquise"}).min(1, {message: "L'abréviation est réquise"}),
    courseType: z.string({required_error: 'Le type de matière est réquis'}),
    discipline: z.string().optional().nullable(),
    department: z.lazy(() =>departmentSchemaMerge.optional().nullable()),
})

export const courseSchemaMerge = z.object({
    id: z.number().optional(),
})