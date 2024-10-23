import {z} from "zod";
import {academicYearSchema} from "./academicYearSchema.ts";
import {studentSchema} from "./studentSchema.ts";
import dayjs from "dayjs";

export const classeStudentBossSchema = z.object({
    id: z.number().optional(),
    academicYear: academicYearSchema.optional(),
    principalStudent: studentSchema.optional(),
    current: z.boolean().default(true).optional(),
    startPeriod: z.preprocess(
        (arg) => {
            if (dayjs.isDayjs(arg)) {
                return arg.toDate()
            }
            if (typeof arg === "string" || arg instanceof Date) {
                const date = dayjs(arg);
                return date.isValid() ? date.toDate() : undefined
            }
        }, z.date({required_error: 'La date du début de mandat est requise'}).refine(date => !!date, {message: 'Date invalid'})
    ).optional(),
    endPeriod: z.preprocess(
        (arg) => {
            if (dayjs.isDayjs(arg)) {
                return arg.toDate()
            }
            if (typeof arg === "string" || arg instanceof Date) {
                const date = dayjs(arg);
                return date.isValid() ? date.toDate() : undefined
            }
        }, z.date({required_error: 'La date de fin de mandat est requise'}).refine(date => !!date, {message: 'Date invalid'})
    ).optional(),
})