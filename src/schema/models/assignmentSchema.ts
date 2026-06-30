import {z} from "zod";
import {classeSchemaMerge, courseSchemaMerge, individualSchemaMerge} from "@/schema";
import {dateProcess, timeProcess} from "../commonSchema.ts";
import {examSchemaMerge} from "./examSchema.ts";
import {AssignmentType} from "@/entity/enums/assignmentType.ts";
import Datetime from "@/core/datetime.ts";
import {semesterIdSchemaMerge} from "@/schema/models/semesterSchema.ts";

export const assignmentSchema = z.object({
    semester: semesterIdSchemaMerge.optional(),
    preparedBy: individualSchemaMerge,
    exam: examSchemaMerge,
    classe: classeSchemaMerge,
    subject: courseSchemaMerge.optional(),
    examName: z.string().min(3, {message: "Le nom de l'examen doit contenir au moins trois characters"}),
    examDate: dateProcess('Date de l`\'examen est requise', {after: true}),
    startTime: timeProcess("L'heure de début est réquis"),
    endTime: timeProcess("L'heure de la fin est réquis"),
    coefficient: z.number().optional(),
    type: z.nativeEnum(AssignmentType, {required_error: 'Le type de devoir est requis'}),
})

export const assignmentDateUpdateSchema = z.object({
    examDate: dateProcess('Date de l`\'examen est requise', {after: true}),
    startTime: timeProcess("L'heure de début est réquis"),
    endTime: timeProcess("L'heure de la fin est réquis"),
    updatedDate: dateProcess('Date de mise à jour est requise')
}).superRefine((data, ctx) => {
    if (data.startTime && data.endTime) {
        const start = Datetime.timeToCurrentDate(data.startTime)
        const end   = Datetime.timeToCurrentDate(data.endTime)

        if (start.isSameOrAfter(end.toDate())) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "L'heure de début doit être antérieure à l'heure de fin",
                path: ['endTime'],
            })
        }
    }
})

export const assignmentMerge = z.object({
    id: z.number().optional()
})