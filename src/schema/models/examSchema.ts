import {z, ZodType} from "zod";
import {classeSchema} from "./classeSchema.ts";
import {courseSchema} from "./courseSchema.ts";
import {scoreSchema} from "./scoreSchema.ts";
import dayjs from "dayjs";
import {planningSchema} from "./planningSchema.ts";
import {examTypeSchema} from "./examTypeSchema.ts";

export const examSchema: ZodType = z.object({
    id: z.number().optional(),
    semester: planningSchema.optional(),
    examType: examTypeSchema.optional(),
    preparedBy: z.string().optional(),
    classe: classeSchema,
    subject: courseSchema.optional(),
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