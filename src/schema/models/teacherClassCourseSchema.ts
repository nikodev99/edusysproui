import {z} from "zod";
import {courseSchemaMerge, classeSchemaMerge} from "@/schema";

export const teacherClassCourseSchema = z.object({
    course: courseSchemaMerge.optional(),
    classe: classeSchemaMerge
})