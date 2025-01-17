import {z} from "zod";
import {SectionType} from "../../entity/enums/section.ts";
import {schoolSchema} from "./schoolSchema.ts";

export const gradeSchema = z.object({
    id: z.number().optional(),
    section: z.nativeEnum(SectionType, {required_error: 'Type de section requis'}),
    subSection: z.string().optional(),
    school: schoolSchema.optional(),
    createdAt: z.union([
        z.date().refine(date => !isNaN(date.getTime()), {message: 'Date invalide'}),
        z.array(z.number()),
    ]).optional(),
    modifiedAt: z.union([
        z.date().refine(date => !isNaN(date.getTime()), {message: 'Date invalide'}),
        z.array(z.number()),
    ]).optional()
})

export const gradeSchemaMerge = z.object({
    id: z.number({required_error: 'Le grade est requis'}),
})