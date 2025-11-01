import {z} from "zod";
import {studentSchema, studentSchemaMerge} from "./studentSchema.ts";
import {classeSchemaMerge} from "./classeSchema.ts";
import {schoolMergeSchema} from "./schoolSchema.ts";
import {loggedUser} from "../../auth/jwt/LoggedUser.ts";

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