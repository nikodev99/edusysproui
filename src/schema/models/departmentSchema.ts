import {z, ZodType} from "zod";
import {schoolMergeSchema} from "./schoolSchema.ts";
import {academicYearSchemaMerge} from "./academicYearSchema.ts";
import {individualSchemaMerge} from "./individualSchema.ts";
import {dateProcess} from "../commonSchema.ts";

export const departmentBossSchema = z.object({
    id: z.number().optional(),
    academicYear: academicYearSchemaMerge.optional(),
    boss: individualSchemaMerge.optional(),
    current: z.boolean().default(true).optional(),
    startPeriod: dateProcess('Date du début de mandat est requise').optional(),
    endPeriod: dateProcess('Date de fin de mandat est requise').optional()
})

export const departmentSchema: ZodType = z.object({
    id: z.number().optional(),
    name: z.string(),
    code:z.string(),
    d_boss: departmentBossSchema.optional(),
    school: schoolMergeSchema.optional(),
})

export const departmentSchemaMerge = z.object({
    id: z.number({required_error: 'Le department est requis'}),
})