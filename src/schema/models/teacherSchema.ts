import {z} from "zod";
import dayjs from "dayjs";
import {schoolMergeSchema} from "./schoolSchema.ts";
import {classeSchemaMerge} from "./classeSchema.ts";
import {teacherIndividualExtend} from "./individualSchema.ts";
import {courseSchemaMerge} from "./courseSchema.ts";

export const teacherSchema = z.lazy(() => z.object({
    personalInfo: teacherIndividualExtend,
    hireDate: z.preprocess(
        (arg) => {
            if (dayjs.isDayjs(arg)) {
                return arg.toDate()
            }
            if (typeof arg === "string" || arg instanceof Date) {
                const date = dayjs(arg);
                return date.isValid() ? date.toDate() : undefined
            }
            return undefined
        }, z.date().refine(date => !isNaN(date.getTime()), {message: 'Date invalide'})
    ).optional(),
    courses: z.array(courseSchemaMerge).optional(),
    classes: z.array(classeSchemaMerge, {required_error: "La(es) classe(s) de l'enseignants est (sont) requis"}),
    salaryByHour: z.number(),
    school: schoolMergeSchema.optional(),
}))