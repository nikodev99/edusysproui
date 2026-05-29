import {z} from "zod";
import {academicYearSchemaMerge, classeSchemaMerge, courseSchemaMerge, teacherSchemaMerge} from "@/schema";
import {semesterIdSchemaMerge} from "@/schema/models/semesterSchema.ts";
import {dateProcess} from "@/schema/commonSchema.ts";
import Datetime from "@/core/datetime.ts";

export const programTiming = z.object({
    dateRange: z.object({
        startDate: dateProcess("La date de début est réquis"),
        endDate: dateProcess("La date de fin est réquis"),
    }),
    status: z.number().default(5),
    completedAt: dateProcess("La date de completion est requise").optional(),
    updatedAt: dateProcess("La date de mis à jour est requise").optional().default(Datetime.now().toDate()),
    academicYear: academicYearSchemaMerge.optional()
}).refine((data) => Datetime.of(data.dateRange.startDate).isBefore(data.dateRange.endDate), {
    message: 'La date de début doit être antérieure à la date de fin',
    path: ["endDate"]
}).refine((data) => Datetime.of(data.dateRange.startDate).compare(data.dateRange.endDate) !== 0, {
    message: "La date de debut ne peut pas être égale à la date de fin",
    path: ["startDate"]
})

export const courseProgramSchemaMerge = z.object({
    id: z.number().optional(),
})

export const topicSchema = z.object({
    courseProgram: courseProgramSchemaMerge,
    title: z.string({required_error: 'Le titre est réquis'}).min(3, {message: "Le titre du sous thème est requis"}),
    timing: programTiming.optional(),
    description: z.string({required_error: 'La description est réquise'})
        .min(10, {message: "La description du sous thème doit contenir au moins 10 caractères"})
        .max(2000, {message: 'La description du sous thème doit contenir au plus 2000 caractères'}),
    order: z.number().optional(),
})

export const courseProgramSchema = z.object({
    topic: z.array(topicSchema).optional().default([]),
    name: z.string().min(3, {message: "Le nom du thème est requis"}),
    purpose: z.string().min(10, {message: "L'objectif du thème doit contenir au moins 10 caractères"}),
    description: z.preprocess(
        (val) => val === "" ? undefined : val,
        z.string()
            .min(10, {message: "La description du thème doit contenir au moins 10 caractères"})
            .max(2000, {message: 'La description du thème doit contenir au plus 2000 caractères'})
            .optional()
    ),
    timing: programTiming,
    semester: semesterIdSchemaMerge.optional(),
    course: courseSchemaMerge.optional(),
    classe: classeSchemaMerge.optional(),
    teacher: teacherSchemaMerge.optional()
})