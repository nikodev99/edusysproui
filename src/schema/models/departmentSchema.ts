import {z, ZodType} from "zod";
import {classeTeacherBossSchema} from "./classeTeacherBossSchema.ts";
import {schoolMergeSchema} from "./schoolSchema.ts";

export const departmentSchema: ZodType = z.object({
    id: z.number(),
    name: z.string(),
    code:z.string(),
    boss: classeTeacherBossSchema.optional(),
    school: schoolMergeSchema.optional(),
    createdAt: z.union([
        z.date().refine(date => !isNaN(date.getTime()), {message: 'Date invalide'}),
        z.array(z.number()),
    ]).optional(),
    modifyAt: z.union([
        z.date().refine(date => !isNaN(date.getTime()), {message: 'Date invalide'}),
        z.array(z.number()),
    ]).optional()
})

export const departmentSchemaMerge = z.object({
    id: z.number({required_error: 'Le department est requis'}),
})