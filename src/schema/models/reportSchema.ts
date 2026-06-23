import {z} from "zod";
import {courseProgramSchemaMerge, topicSchemaMerge, teacherSchemaMerge, scheduleSchemaMerge} from "@/schema";
import {dateProcess, timeProcess} from "@/schema/commonSchema.ts";

export const reportSchema = z.object({
    courseProgram: courseProgramSchemaMerge,
    courseProgramTopic: topicSchemaMerge,
    teacher: teacherSchemaMerge,
    schedule: scheduleSchemaMerge,
    sessionDate: dateProcess("Date de session est requise"),
    sessionStartingTime: timeProcess("Heure de debut de session est requise"),
    sessionEndingTime: timeProcess("Heure de fin de session est requise"),
    isLateSubmission: z.boolean().optional(),
    reportStatus: z.number().optional(),
    notes: z.string()
        .min(100, {message: "Les observations doivent avoir entre 100 et 2000 caractères."})
        .max(2000, {message: "Le nombre de caractère maximum '2000' dépassé"})
});