import {z, ZodType} from "zod";
import {schoolMergeSchema} from "@/schema";
import {planningSchema} from "@/schema";

export const gradeSchema: ZodType = z.object({
    id: z.number().optional(),
    section: z.string({required_error: 'La section est requise'}),
    subSection: z.string().optional(),
    planning: z.lazy(() => z.array(planningSchema)),
    school: z.lazy(() => schoolMergeSchema.optional()),
})

export const gradeSchemaMerge = z.object({
    id: z.number({required_error: 'Le grade est requis'}),
})