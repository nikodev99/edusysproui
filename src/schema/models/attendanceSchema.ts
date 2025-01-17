import {z} from "zod";
import {AttendanceStatus} from "../../entity/enums/attendanceStatus.ts";
import {academicYearSchema} from "./academicYearSchema.ts";
import {studentSchema} from "./studentSchema.ts";
import {classeSchemaMerge} from "./classeSchema.ts";
import dayjs from "dayjs";

export const attendanceSchema = z.object({
    id: z.number().optional(),
    academicYear: academicYearSchema.optional(),
    student: studentSchema.optional(),
    classe: classeSchemaMerge.optional(),
    attendanceDate: z.preprocess(
        (arg) => {
            if (dayjs.isDayjs(arg)) {
                return arg.toDate()
            }
            if (typeof arg === "string" || arg instanceof Date) {
                const date = dayjs(arg);
                return date.isValid() ? date.toDate() : undefined
            }
        }, z.date({required_error: 'Date du status de présence est requise'}).refine(date => !!date, {message: 'Date invalid'})
    ),
    status: z.nativeEnum(AttendanceStatus, {required_error: 'Le status de présence est requis'})
})