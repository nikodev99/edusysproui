import {z, ZodType} from "zod";
import {schoolMergeSchema} from "./schoolSchema.ts";
import {academicYearSchemaMerge} from "./academicYearSchema.ts";
import {individualSchemaMerge} from "./individualSchema.ts";
import {dateProcess, excludeSpecialCharacters} from "../commonSchema.ts";
import {gradeSchemaMerge} from "./gradeSchema.ts";

export const departmentBossSchema = z.object({
    id: z.number().optional().nullable(),
    academicYear: academicYearSchemaMerge.optional().nullable(),
    d_boss: individualSchemaMerge.optional().nullable(),
    current: z.boolean().default(true).optional().nullable(),
    startPeriod: dateProcess('Date du début de mandat est requise').optional().nullable(),
    endPeriod: dateProcess('Date de fin de mandat est requise').optional().nullable()
})

export const departmentSchema: ZodType = z.object({
    id: z.number().optional(),
    name: excludeSpecialCharacters({
        requiredError: 'Le nom du département est réquis',
        regexError: 'Le nom du département ne doit pas contenir de caractères spéciaux.'
    }),
    code:excludeSpecialCharacters({
        requiredError: 'Le nom du département est réquis',
        regexError: 'Le nom du département ne doit pas contenir de caractères spéciaux.'
    }).min(3, {
        message: "L'intitulé doit avoir au moins 3 caractères"
    }).max(50, {
        message: "L'intitulé doit contenir moins de 50 caractères"
    }),
    purpose: z.string().max(500, {message: 'Maximum de 500 caractères atteint'}).optional().nullable(),
    grade: gradeSchemaMerge.optional().nullable(),
    boss: departmentBossSchema.optional().nullable(),
    school: schoolMergeSchema.optional(),
})

export const departmentSchemaMerge = z.object({
    id: z.number({required_error: 'Le department est requis'}),
})