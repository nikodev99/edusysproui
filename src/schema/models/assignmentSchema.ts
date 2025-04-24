import {z} from "zod";
import {classeSchemaMerge} from "./classeSchema.ts";
import {courseSchemaMerge} from "./courseSchema.ts";
import {scoreSchema} from "./scoreSchema.ts";
import {dateProcess, timeProcess} from "../dateSchema.ts";

export const assignmentSchema = z.object({
    id: z.bigint().optional(),
    semester: z.string().optional(),
    preparedBy: z.string().optional(),
    classe: classeSchemaMerge,
    subject: courseSchemaMerge.optional(),
    examName: z.string(),
    examDate: dateProcess('Date de l`\'examen est requise'),
    startTime: z.string().refine(value => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)).optional(),
    endTime: z.string().refine(value => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)).optional(),
    marks: z.array(scoreSchema).optional()
})

export const assignmentDateUpdateSchema = z.object({
    examDate: dateProcess('Date de l`\'examen est requise'),
    startTime: timeProcess("L'heure de début est réquis"),
    endTime: timeProcess("L'heure de la fin est réquis"),
    updatedDate: dateProcess('Date de l`\'examen est requise')
})