import {z, ZodType} from "zod";
import {examTypeSchema} from "./examTypeSchema.ts";
import {assignmentSchema} from "./AssignmentSchema.ts";

export const examSchema: ZodType = z.object({
    id: z.number().optional(),
    examType: examTypeSchema.optional(),
    assignments: z.array(assignmentSchema)
})