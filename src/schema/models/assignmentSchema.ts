import {z} from "zod";
import {classeSchemaMerge} from "./classeSchema.ts";
import {courseSchemaMerge} from "./courseSchema.ts";
import {scoreSchema} from "./scoreSchema.ts";
import Datetime from "../../core/datetime.ts";
import dayjs from "dayjs";

const dateProcess = z.preprocess(
    (arg) => {
        return Datetime.of(arg as string).plusHour(1).toDate()
    }, z.date({required_error: 'Date de l`\'examen est requise'}).refine(date => !!date, {message: 'Date invalid'})
)

const timeProcess = (title: string) => z.preprocess(
    (arg) => {
        if (!arg) return ''
        if (dayjs.isDayjs(arg) || typeof arg === "string")
            return Datetime.of(arg).format("HH:mm")
    }, z.string({required_error: title})
)

export const assignmentSchema = z.object({
    id: z.bigint().optional(),
    semester: z.string().optional(),
    preparedBy: z.string().optional(),
    classe: classeSchemaMerge,
    subject: courseSchemaMerge.optional(),
    examName: z.string(),
    examDate: dateProcess,
    startTime: z.string().refine(value => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)).optional(),
    endTime: z.string().refine(value => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)).optional(),
    marks: z.array(scoreSchema).optional()
})

export const assignmentDateUpdateSchema = z.object({
    examDate: dateProcess,
    startTime: timeProcess("L'heure de début est réquis"),
    endTime: timeProcess("L'heure de la fin est réquis"),
    updatedDate: dateProcess
})