import {z, ZodType} from "zod";
import {Day} from "../../entity/enums/day.ts";
import {academicYearSchema} from "./academicYearSchema.ts";
import {classeSchema} from "./classeSchema.ts";
import {teacherSchema} from "./teacherSchema.ts";
import {courseSchema} from "./courseSchema.ts";

export const scheduleSchema: ZodType = z.object({
    id: z.bigint().optional(),
    academicYear: academicYearSchema.optional(),
    classe: classeSchema.optional(),
    teacher: teacherSchema.optional(),
    course: courseSchema.optional(),
    designation: z.string().optional(),
    dayOfWeek: z.nativeEnum(Day, {required_error: 'Jour du programme requis'}),
    startTime: z.string().refine(value => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)).optional(),
    endTime: z.string().refine(value => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)).optional()
})