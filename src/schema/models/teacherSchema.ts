import {z} from "zod";
import {schoolMergeSchema, courseSchemaMerge, classeSchemaMerge, academicYearSchemaMerge} from "@/schema";
import {teacherIndividualExtend} from "./individualSchema.ts";
import {IndividualType} from "@/core/shared/sharedEnums.ts";
import {employeeContractSchema} from "@/schema/models/employeeSchema.ts";
import {dateProcess} from "@/schema/commonSchema.ts";
import Datetime, {DateFormat} from "@/core/datetime.ts";

export const teacherSchema = z.lazy(() => z.object({
    personalInfo: teacherIndividualExtend.extend({
        individualType: z.number({required_error: "Le type de l'individu est requis"}).default(IndividualType.TEACHER),
    }),
    courses: z.array(teacherCourseSchema).optional(),
    classes: z.array(teacherClasseSchema, {required_error: "La(es) classe(s) de l'enseignants est (sont) requis"}),
    school: schoolMergeSchema.optional(),
    contract: employeeContractSchema
}))

export const teacherClasseSchema = z.object({
    classe: classeSchemaMerge.optional(),
})

export const teacherCourseSchema = z.object({
    course: courseSchemaMerge.optional(),
})

export const teacherSchemaMerge = z.object({
    id: z.string({required_error: 'L\'enseignant est requis'}),
})

export const teacherSchoolAffiliationSchema = z.object({
    courses: z.array(teacherCourseSchema).optional(),
    classes: z.array(teacherClasseSchema, {required_error: "La(es) classe(s) de l'enseignants est (sont) requis"}),
    school: schoolMergeSchema.optional(),
    status: z.string().default('ACTIVE'),
    contract: employeeContractSchema,
    teacher: teacherSchemaMerge
})

export const teacherBossSchema = z.object({
    academicYear: academicYearSchemaMerge,
    classe: classeSchemaMerge,
    principalTeacher: teacherSchemaMerge,
    current: z.boolean().optional().default(true),
    startPeriod: dateProcess("").optional().default(Datetime.now().format(DateFormat.ISO_DATE))
})