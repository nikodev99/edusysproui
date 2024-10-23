import {z, ZodType} from "zod";
import {classeTeacherBossSchema} from "./classeTeacherBossSchema.ts";
import {schoolSchema} from "./schoolSchema.ts";

export const departmentSchema: ZodType = z.object({
    id: z.number(),
    name: z.string(),
    code:z.string(),
    boss: classeTeacherBossSchema.optional(),
    school: schoolSchema.optional(),
    createdAt: z.union([
        z.date().refine(date => !isNaN(date.getTime()), {message: 'Date invalide'}),
        z.array(z.number()),
    ]).optional(),
    modifyAt: z.union([
        z.date().refine(date => !isNaN(date.getTime()), {message: 'Date invalide'}),
        z.array(z.number()),
    ]).optional()
})