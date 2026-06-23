import {z, ZodType} from "zod";
import {Day} from "@/entity/enums/day.ts";
import {academicYearSchema} from "@/schema";
import {classeSchemaMerge} from "@/schema";
import {teacherSchema} from "@/schema";
import {courseSchemaMerge} from "@/schema";

export const scheduleSchema: ZodType = z.object({
    id: z.bigint().optional(),
    academicYear: academicYearSchema.optional(),
    classe: classeSchemaMerge.optional(),
    teacher: teacherSchema.optional(),
    course: courseSchemaMerge.optional(),
    designation: z.string().optional(),
    dayOfWeek: z.nativeEnum(Day, {required_error: 'Jour du programme requis'}),
    startTime: z.string().refine(value => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)).optional(),
    endTime: z.string().refine(value => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)).optional()
})

export const scheduleSchemaMerge = z.object({
    id: z.number(),
})