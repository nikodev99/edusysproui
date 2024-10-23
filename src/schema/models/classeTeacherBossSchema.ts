import {z} from "zod";
import {academicYearSchema} from "./academicYearSchema.ts";
import {teacherSchema} from "./teacherSchema.ts";
import dayjs from "dayjs";

export const classeTeacherBossSchema = z.object({
    id: z.number().optional(),
    academicYear: academicYearSchema.optional(),
    principalTeacher: teacherSchema.optional(),
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
        }, z.date({required_error: 'Date du début de mandat est requise'}).refine(date => !!date, {message: 'Date invalid'})
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
        }, z.date({required_error: 'Date de fin de mandat est requise'}).refine(date => !!date, {message: 'Date invalid'})
    ).optional()
})