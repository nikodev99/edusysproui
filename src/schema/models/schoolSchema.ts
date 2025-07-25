import {z} from "zod";
import {dateProcess, excludeSpecialCharacters} from "../commonSchema.ts";

export const schoolSchema = z.object({
    name: excludeSpecialCharacters({
            requiredError: "Le nom de l'établissement est requis",
            regexError: "Le nom ne doit pas contenir des characters spéciaux"
        })
        .min(3, {
            message: "Le nom de l'établissement doit contenir au moins trois characters"
        }),
    abbr: excludeSpecialCharacters({
            requiredError: "L'abréviation de l'établissement est requise",
            regexError: "L'abréviation ne doit pas contenir des characters spéciaux"
        })
        .min(3, {
            message: "L'abréviation doit contenir au moins trois characters"
        }),
    foundedDate: dateProcess('La date de creation est requise'),
    contactEmail: z.string().email({message: "L'email est invalide"}),
    phoneNumber: z.string()
        .min(1, {message: 'Le numéro de téléphone est requis'})
        .length(9, {message: 'Entrer un numéro de téléphone valide avec 9 chiffres'}),
    websiteURL: z.string().url({message: "L'URL est invalide"}).optional(),
    accreditationCode: excludeSpecialCharacters({regexError: "L'accréditation ne peut pas contenir des character spéciaux"}).optional(),
    accreditationNumber: excludeSpecialCharacters({regexError: "L'accréditation ne peut pas contenir des character spéciaux"}).optional(),
})

export const schoolMergeSchema = z.object({
    id: z.string().nullable().optional()
})
