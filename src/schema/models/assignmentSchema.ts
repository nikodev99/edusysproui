import {z} from "zod";
import {classeSchemaMerge} from "./classeSchema.ts";
import {courseSchemaMerge} from "./courseSchema.ts";
import {dateProcess, timeProcess} from "../dateSchema.ts";
import {planningSchemaMerge} from "./planningSchema.ts";
import {individualSchemaMerge} from "./individualSchema.ts";
import {examSchemaMerge} from "./examSchema.ts";
import {AssignmentType} from "../../entity/enums/assignmentType.ts";

export const assignmentSchema = z.object({
    semester: planningSchemaMerge,
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
})

export const assignmentMerge = z.object({
    id: z.number().optional()
})