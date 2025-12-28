import {z} from "zod";
import {studentSchema, studentSchemaMerge, classeSchemaMerge, schoolMergeSchema} from "@/schema";
import {loggedUser} from "@/auth/jwt/LoggedUser.ts";

export const enrollmentSchema = (isRerun?: boolean) => z.object({
    academicYear: z.object({
        id: z.string().min(1, {message: "L'année scolaire/académique est requise"}),
        school: schoolMergeSchema.optional().default({
            id: loggedUser.getSchool()?.id
        })
    }),
    student: isRerun ? studentSchemaMerge : studentSchema,
    classe: classeSchemaMerge
})

export const enrollmentMergeSchema = z.object({
    id: z.number({required_error: "Etudiant inscrit est réquis"})
})