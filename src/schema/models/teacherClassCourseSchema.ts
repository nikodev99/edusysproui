import {z} from "zod";
import {courseSchema} from "./courseSchema.ts";
import {classeSchema} from "./classeSchema.ts";

export const teacherClassCourseSchema = z.object({
    course: courseSchema.optional(),
    classe: classeSchema
})