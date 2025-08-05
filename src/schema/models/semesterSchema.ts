import {z} from "zod";
import {academicYearSchema} from "./academicYearSchema.ts";
import {dateProcess} from "../commonSchema.ts";

export const semesterTemplateSchema = z.object({
    semesterName: z.string(),
    description: z.string(),
    displayOrder: z.number().optional()
})

export const semesterSchema = z.object({
    semesterId: z.number().optional(),
    template: semesterTemplateSchema,
    startDate: dateProcess('Date de début du semestre est requise'),
    endDate: dateProcess('Date de fin du semestre est requise'),
    academicYear: academicYearSchema.optional(),
})

export const allSemesterSchema = z.object({
    semesters: z.array(semesterSchema)
})

export const semesterSchemaMerge = z.object({
    id: z.number({required_error: 'Le semestre est requis'}),
})
