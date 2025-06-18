import {z} from "zod";
import {AttendanceStatusLiteral} from "../../entity/enums/attendanceStatus.ts";
import {academicYearSchemaMerge} from "./academicYearSchema.ts";
import {classeSchemaMerge} from "./classeSchema.ts";
import {dateProcess} from "../dateSchema.ts";
import {individualSchemaMerge} from "./individualSchema.ts";

export const singleAttendanceSchema = z.object({
    id: z.number().optional(),
    academicYear: academicYearSchemaMerge.optional(),
    individual: individualSchemaMerge,
    classe: classeSchemaMerge,
    attendanceDate: dateProcess('Date du status de présence est requise', {before: true}),
    status: z.nativeEnum(AttendanceStatusLiteral, {required_error: 'Le status de présence est requis'})
})

export const attendanceSchema = z.object({
    attendance: z.record(singleAttendanceSchema)
})