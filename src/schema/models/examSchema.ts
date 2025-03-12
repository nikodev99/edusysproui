import {z, ZodType} from "zod";
import {examTypeSchema} from "./examTypeSchema.ts";
import {assignmentSchema} from "./assignmentSchema.ts";

export const examSchema: ZodType = z.lazy(() => z.object({
    id: z.number().optional(),
    examType: examTypeSchema.optional(),
    assignments: z.array(assignmentSchema)
}))