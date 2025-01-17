import {z} from "zod";
import {courseSchemaMerge} from "./courseSchema.ts";
import {classeSchemaMerge} from "./classeSchema.ts";

export const teacherClassCourseSchema = z.object({
    course: courseSchemaMerge.optional(),
    classe: classeSchemaMerge
})