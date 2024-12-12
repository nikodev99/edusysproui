import {z} from "zod";
import {studentSchema} from "./studentSchema.ts";
import {examSchema} from "./examSchema.ts";

export const scoreSchema = z.lazy(() => z.object({
    id: z.bigint().optional(),
    exam: examSchema,
    student: studentSchema.optional(),
    obtainedMark: z.number()
}))