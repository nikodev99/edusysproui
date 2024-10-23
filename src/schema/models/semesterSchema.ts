import {z} from "zod";
import {academicYearSchema} from "./academicYearSchema.ts";
import dayjs from "dayjs";

export const semesterSchema = z.object({
    semesterId: z.number().optional(),
    semesterName: z.string(),
    academicYear: academicYearSchema.optional(),
    startDate: z.preprocess(
        (arg) => {
            if (dayjs.isDayjs(arg)) {
                return arg.toDate()
            }
            if (typeof arg === "string" || arg instanceof Date) {
                const date = dayjs(arg);
                return date.isValid() ? date.toDate() : undefined
            }
        }, z.date({required_error: 'Date du début du semestre est requise'}).refine(date => !!date, {message: 'Date invalid'})
    ),
    endDate: z.preprocess(
        (arg) => {
            if (dayjs.isDayjs(arg)) {
                return arg.toDate()
            }
            if (typeof arg === "string" || arg instanceof Date) {
                const date = dayjs(arg);
                return date.isValid() ? date.toDate() : undefined
            }
        }, z.date({required_error: 'Date de la fin du semestre est requise'}).refine(date => !!date, {message: 'Date invalid'})
    ),
    description: z.string()
})