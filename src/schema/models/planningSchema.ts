import {z} from "zod";
import {academicYearSchemaMerge} from "./academicYearSchema.ts";
import {semesterSchemaMerge} from "./semesterSchema.ts";
import {gradeSchemaMerge} from "./gradeSchema.ts";
import {dateProcess} from "../commonSchema.ts";

export const planningSchema = z.lazy(() => z.object({
    id: z.number().optional(),
    academicYear: academicYearSchemaMerge.optional(),
    designation: z.string(),
    termStartDate: dateProcess('Date de debut du terme est requise'),
    termEndDate: dateProcess('Date de fin du terme est requise'),
    semester: semesterSchemaMerge,
    grade: gradeSchemaMerge.optional(),
}))

export const planningSchemaMerge = z.object({
    id: z.number({required_error: 'Le planning est requis'}),
})