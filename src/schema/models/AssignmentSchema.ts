import {z} from "zod";
import {classeSchemaMerge} from "./classeSchema.ts";
import {courseSchemaMerge} from "./courseSchema.ts";
import dayjs from "dayjs";
import {scoreSchema} from "./scoreSchema.ts";

export const assignmentSchema = z.object({
    id: z.bigint().optional(),
    semester: z.string().optional(),
    preparedBy: z.string().optional(),
    classe: classeSchemaMerge,
    subject: courseSchemaMerge.optional(),
    examName: z.string(),
    examDate: z.preprocess(
        (arg) => {
            if (dayjs.isDayjs(arg)) {
                return arg.toDate()
            }
            if (typeof arg === "string" || arg instanceof Date) {
                const date = dayjs(arg);
                return date.isValid() ? date.toDate() : undefined
            }
        }, z.date({required_error: 'Date de l`\'examen est requise'}).refine(date => !!date, {message: 'Date invalid'})
    ),
    startTime: z.string().refine(value => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)).optional(),
    endTime: z.string().refine(value => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)).optional(),
    marks: z.array(scoreSchema).optional()
})