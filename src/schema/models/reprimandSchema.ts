import {z} from "zod";
import {
    academicYearSchemaMerge,
    classeSchemaMerge,
    enrollmentMergeSchema,
    individualSchemaMerge
} from "@/schema";
import {dateProcess} from "@/schema/commonSchema.ts";
import {punishmentSchema} from "@/schema/models/punishmentSchema.ts";

export const reprimandSchema = z.object({
    academicYear: academicYearSchemaMerge,
    student: enrollmentMergeSchema,
    classe: classeSchemaMerge,
    reprimandDate: dateProcess("La date est obligatoire"),
    type: z.string({required_error: "Le type de reprimande est réquis"}),
    description: z.string()
        .min(20, {message: "La description doit contenir au moin 20 caractères"})
        .max(2000, {message: "La description doit contenir au plus 2000 caractères"})
        .optional(),
    issuedBy: individualSchemaMerge,
    punishment: punishmentSchema,
})