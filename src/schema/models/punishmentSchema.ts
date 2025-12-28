import {z} from "zod";
import {dateProcess} from "@/schema/commonSchema.ts";

export const punishmentSchema = z.object({
    isRequire: z.boolean(),
    type: z.string({required_error: "Le type de punition est obligatoire"}),
    dateRange: z.object({
        startDate: dateProcess("La date de début est réquis"),
        endDate: dateProcess("La date de fin est réquis").optional(),
    }),
    status: z.string({required_error: "Le status de la punition est réquis"}),
    executedBy: z.string().optional(),
    description: z.string()
        .min(20, {message: "La description doit contenir au moin 20 caractères"})
        .max(2000, {message: "La description doit contenir au plus 2000 caractères"})
        .optional(),
    appealed: z.boolean().default(false).optional(),
    appealedNote: z.string()
        .min(20, {message: "La description doit contenir au moin 20 caractères"})
        .max(2000, {message: "La description doit contenir au plus 2000 caractères"})
        .optional()
}).refine((data) => data.dateRange.endDate >= data.dateRange.startDate, {
    message: "La date de fin doit venir avant la date de début", path: ["endDate"]
})