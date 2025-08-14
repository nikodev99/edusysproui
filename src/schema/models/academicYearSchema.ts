import {z, ZodType} from "zod";
import {schoolMergeSchema} from "./schoolSchema.ts";
import {dateProcess} from "../commonSchema.ts";
import Datetime from "../../core/datetime.ts";
import {semesterSchema} from "./semesterSchema.ts";

export const academicYearSchema: ZodType = z.lazy(() => z.object({
    startDate: dateProcess("La date de début est requise"),
    endDate: dateProcess("La date de fin est requise"),
    semesters: z.array(semesterSchema),
    school: schoolMergeSchema.optional()
})).refine((data) => {
    return Datetime.of(data.startDate).compare(data.endDate) !== 0
}, {
    message: "La date de debut ne peut pas être égale à la date de fin",
    path: ["startDate"]
}).refine((data) => {
    return Datetime.of(data.startDate).isBefore(data.endDate);
}, {
    message: 'La date de début doit être antérieure à la date de fin',
    path: ["endDate"]
})

export const academicYearSchemaMerge = z.object({
    id: z.string()
})