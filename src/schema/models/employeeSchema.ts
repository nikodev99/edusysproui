import {z} from "zod";
import {teacherIndividualExtend} from "./individualSchema.ts";
import {schoolMergeSchema} from "./schoolSchema.ts";
import {dateProcess} from "../commonSchema.ts";
import {IndividualType} from "../../core/shared/sharedEnums.ts";

export const employeeSchema = z.object({
    personalInfo: teacherIndividualExtend.extend({
        individualType: z.number({required_error: "Le type de l'individu est requis"}).default(IndividualType.EMPLOYEE),
    }),
    school: schoolMergeSchema.optional(),
    jobTitle: z.string().min(1, {message: "Le titre de poste est requis"}),
    salary: z.number().optional(),
    contractType: z.string({required_error: 'Le type de contrat est requis'}).min(1, {message: "Le type de contrat est requis"}),
    hireDate: dateProcess('Date de recrutement est requise'),
})