import {z} from "zod";
import {academicYearSchemaMerge} from "./academicYearSchema.ts";
import {dateProcess} from "../commonSchema.ts";
import {schoolMergeSchema} from "./schoolSchema.ts";
import Datetime from "../../core/datetime.ts";

export const semesterTemplateSchema = z.object({
    id: z.number().optional(),
    semesterName: z.string(),
    description: z.string(),
    displayOrder: z.number().optional(),
    school: schoolMergeSchema.optional(),
})

export const semesterSchema = z.lazy(() => z.object({
    semesterId: z.number().optional(),
    template: templateSemesterSchema,
    startDate: dateProcess('Date de début du semestre est requise'),
    endDate: dateProcess('Date de fin du semestre est requise'),
    academicYear: academicYearSchemaMerge.optional(),
}).refine((data) => {
    return Datetime.of(data.startDate).compare(data.endDate) !== 0
}, {
    message: "La date de début ne peut pas être égale à la date de fin",
    path: ["startDate"]
}).refine((data) => {
    return Datetime.of(data.startDate).isBefore(data.endDate);
}, {
    message: 'La date de début doit être antérieure à la date de fin',
    path: ["endDate"]
}))

export const templateSemesterSchema = z.object({
    id: z.number().optional()
})

export const allSemesterTemplateSchema = z.object({
    semesters: z.array(semesterTemplateSchema)
})

export const allSemesterSchema = z.object({
    semesters: z.array(semesterSchema)
})

export const semesterSchemaMerge = z.object({
    semesterId: z.number({required_error: 'Le semestre est requis'}),
    startDate: dateProcess('Ajouter les dates').optional(),
    endDate: dateProcess('Ajouter les dates').optional(),
})
