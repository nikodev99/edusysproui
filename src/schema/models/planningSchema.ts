import {z} from "zod";
import {semesterSchemaMerge} from "./semesterSchema.ts";
import {gradeSchemaMerge} from "./gradeSchema.ts";
import {dateProcess} from "../commonSchema.ts";
import Datetime from "../../core/datetime.ts";

export const planningSchema = z.lazy(() => z.object({
    id: z.number().optional(),
    designation: z.string(),
    termStartDate: dateProcess('Date de debut du terme est requise'),
    termEndDate: dateProcess('Date de fin du terme est requise'),
    semester: semesterSchemaMerge,
    grade: gradeSchemaMerge.optional(),
}))
.refine((data) => {
    return Datetime.of(data.termStartDate).isAfter(data.semester.startDate)
}, {
    message: "Votre date ne correspond pas au dates de debut de votre semestre",
    path: ["termStartDate"]
}).refine(data => {
    return Datetime.of(data.termEndDate).isBefore(data.semester.endDate)
}, {
    message: "Votre date ne correspond pas au dates de fin de votre semestre",
    path: ["termEndDate"]
})

export const planningSchemaMerge = z.object({
    id: z.number({required_error: 'Le planning est requis'}),
})