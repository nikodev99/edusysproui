import {z, ZodType} from "zod";
import {schoolMergeSchema} from "./schoolSchema.ts";
import {planningSchema} from "./planningSchema.ts";

export const gradeSchema: ZodType = z.object({
    id: z.number().optional(),
    section: z.string({required_error: 'La section est requise'}),
    subSection: z.string().optional(),
    planning: z.array(planningSchema).optional(),
    school: schoolMergeSchema.optional(),
})

export const gradeSchemaMerge = z.object({
    id: z.number({required_error: 'Le grade est requis'}),
})