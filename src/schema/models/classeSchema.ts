import {z} from "zod";
import {gradeSchemaMerge, departmentSchemaMerge, courseSchemaMerge} from "@/schema";

export const classeSchema = z.object({
    name: z.string({required_error: 'Le nom de la classe est requis'}).min(2, {
        message: "Le nom d'une classe doit contenir au moins deux characters"
    }),
    category: z.string().optional(),
    grade: z.lazy(() => gradeSchemaMerge),
    department: z.lazy(() => departmentSchemaMerge.optional().nullable()),
    roomNumber: z.number().optional().default(0),
    monthCost: z.number({required_error: 'Le montant par mois de la classe est requis'}),
    principalCourse: z.lazy(() => courseSchemaMerge.optional().nullable()),
})

export const classeSchemaMerge = z.object({
    id: z.number()
})
