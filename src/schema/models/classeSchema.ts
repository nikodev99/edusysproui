import {z} from "zod";
import {gradeSchemaMerge} from "./gradeSchema.ts";
import {departmentSchemaMerge} from "./departmentSchema.ts";

export const classeSchema = z.object({
    name: z.string({required_error: 'Le nom de la classe est requis'}).min(2, {
        message: "Le nom d'une classe doit contenir au moins deux characters"
    }),
    category: z.string().optional(),
    grade: gradeSchemaMerge,
    department: departmentSchemaMerge.optional().nullable(),
    roomNumber: z.number().optional(),
    monthCost: z.number({required_error: 'Le montant par mois de la classe est requis'}),
})

export const classeSchemaMerge = z.object({
    id: z.number()
})
