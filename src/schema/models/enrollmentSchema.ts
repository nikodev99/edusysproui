import {z} from "zod";
import {studentSchema} from "./studentSchema.ts";
import {classeSchema} from "./classeSchema.ts";
import {schoolSchema} from "./schoolSchema.ts";

export const enrollmentSchema = z.object({
    academicYear: z.string().min(1, {message: "L'année scolaire est requise"}),
    student: studentSchema,
    classe: classeSchema,
    school: schoolSchema
})