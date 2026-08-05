import {z, ZodType} from "zod";
import {academicYearSchemaMerge} from "@/schema";
import {classeSchemaMerge} from "@/schema";
import {courseSchemaMerge} from "@/schema";
import {excludeSpecialCharacters, timeProcess} from "@/schema/commonSchema.ts";

export const scheduleSchema: ZodType = z.object({
    id: z.bigint().optional(),
    academicYear: academicYearSchemaMerge.optional(),
    classe: classeSchemaMerge.optional(),
    teacher: z.object({
        id: z.string().optional()
    }).optional(),
    course: courseSchemaMerge.optional(),
    designation: excludeSpecialCharacters({regexError: "La désignation ne doit pas contenir des caractères spéciaux"})
        .min(5, {message: "La désignation doit avoir au moins 5 caractères"})
        .max(50, {message: "Veuillez ne pas dépoassé 50 caractère pour la désignation"}),
    dayOfWeek: z.number({required_error: 'Jour du programme requis'}),
    startTime: timeProcess("").optional(),
    endTime: timeProcess("").optional()
})

export const scheduleSchemaMerge = z.object({
    id: z.number(),
})