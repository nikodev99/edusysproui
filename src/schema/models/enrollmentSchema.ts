import {z} from "zod";
import {studentSchema} from "./studentSchema.ts";
import {classeSchema} from "./classeSchema.ts";

export const enrollmentSchema = z.object({
    academicYear: z.object({
        id: z.string().min(1, {message: "L'année scolaire/académique est requise"})
    }),
    student: studentSchema,
    classe: classeSchema
})