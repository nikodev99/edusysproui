import {z} from "zod";
import dayjs from "dayjs";
import {addressSchema} from "./addressSchema.ts";
import {teacherClassCourseSchema} from "./teacherClassCourseSchema.ts";
import {schoolSchema} from "./schoolSchema.ts";

export const teacherSchema = z.object({
    firstName: z.string().min(1, {message: "Prénom est requis"}),
    lastName: z.string().min(3, {message: "Nom de famille est requis"}),
    maidenName: z.string().nullable().optional(),
    status: z.union([z.string({required_error: "Le status est requis"}), z.number({required_error: "Le status est requis"})]),
    birthDate: z.preprocess(
        (arg) => {
            if (dayjs.isDayjs(arg)) {
                return arg.toDate()
            }
            if (typeof arg === "string" || arg instanceof Date) {
                const date = dayjs(arg);
                return date.isValid() ? date.toDate() : undefined
            }
            return undefined
        }, z.date({required_error: 'La date de naissance est requise'}).refine(date => !!date, {message: 'Date invalid'})
    ),
    cityOfBirth: z.string().min(1, {message: "Ville est requis"}),
    nationality: z.string({required_error: "La nationalité est requise"}),
    gender: z.union([z.string({required_error: "Le genre est requis"}), z.number({required_error: "Le genre est requis"})]),
    address: addressSchema,
    emailId: z.string().min(1, {message: 'Email est requis'}).email({message: 'Email non conforme'}),
    telephone: z.string()
        .min(1, {message: 'Le numéro de téléphone est requis'})
        .length(9, {message: 'Entrer un numéro de téléphone valide avec 9 chiffres'}),
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
    teacherClassCourses: z.array(teacherClassCourseSchema),
    salaryByHour: z.number(),
    image: z.string().optional(),
    attachments: z.array(z.string()).optional(),
    school: schoolSchema.optional(),
})