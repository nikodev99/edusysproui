import {z} from "zod";
import {academicYearSchema} from "./academicYearSchema.ts";
import dayjs from "dayjs";
import {semesterSchema} from "./semesterSchema.ts";
import {gradeSchema} from "./gradeSchema.ts";

export const planningSchema = z.object({
    id: z.number().optional(),
    academicYear: academicYearSchema.optional(),
    designation: z.string(),
    termStartDate: z.preprocess(
        (arg) => {
            if (dayjs.isDayjs(arg)) {
                return arg.toDate()
            }
            if (typeof arg === "string" || arg instanceof Date) {
                const date = dayjs(arg);
                return date.isValid() ? date.toDate() : undefined
            }
        }, z.date({required_error: 'Date de debut du terme est requise'}).refine(date => !!date, {message: 'Date invalid'})
    ),
    termEndDate: z.preprocess(
        (arg) => {
            if (dayjs.isDayjs(arg)) {
                return arg.toDate()
            }
            if (typeof arg === "string" || arg instanceof Date) {
                const date = dayjs(arg);
                return date.isValid() ? date.toDate() : undefined
            }
        }, z.date({required_error: 'Date de la fin du terme est requise'}).refine(date => !!date, {message: 'Date invalid'})
    ),
    semester: semesterSchema,
    grade: gradeSchema,
    createdAt: z.union([
        z.date().refine(date => !isNaN(date.getTime()), {message: 'Date invalide'}),
        z.array(z.number()),
    ]).optional(),
    updatedAt: z.union([
        z.date().refine(date => !isNaN(date.getTime()), {message: 'Date invalide'}),
        z.array(z.number()),
    ]).optional(),
})

export const planningSchemaMerge = z.object({
    id: z.number({required_error: 'Le planning est requis'}),
})