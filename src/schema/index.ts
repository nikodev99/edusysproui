import {z} from "zod";

const addressSchema = z.object({
    number: z.string(),
    street: z.string().min(1, {message: "Rue est requis"}),
    secondStreet: z.string().optional(),
    neighborhood: z.string(),
    borough: z.string().optional(),
    city: z.string(),
    zipCode: z.string().optional(),
    country: z.string(),
})

const healthSchema = z.object({
    bloodType: z.string().min(1, {message: "Ajouter le groupe sanguin de l'étudiant est requis"}),
    weight: z.number(),
    height: z.number(),
    handicap: z.string().optional(),
    medicalConditions: z.array(z.string()).optional(),
    allergies: z.array(z.string()).optional(),
    medications: z.array(z.string()).optional()
})

export const classeSchema = z.object({
    id: z.number()
})

export const guardianSchema = z.object({
    lastName: z.string().min(1, {message: 'Nom de famille est requis'}),
    firstName: z.string().min(1, {message: 'Prénom est requis'}),
    gender: z.union([z.string(), z.number()]),
    status: z.union([z.string(), z.number()]),
    maidenName: z.string().optional(),
    emailId: z.union([
        z.string().length(0),
        z.string().email({
            message: 'Entrer un email valid'
        })
    ]).optional().transform(e => e === "" ? undefined : e),
    company: z.string().optional(),
    jobTitle: z.string().optional(),
    telephone: z.string().length(9, {message: 'Entrer une numéro de téléphone valid avec 9 chiffres'}),
    mobile: z.string().optional(),
    address: addressSchema.optional()
})

export const studentSchema = z.object({
    lastName: z.string().min(3, {message: "Nom de famille est requis"}),
    firstName: z.string().min(1, {message: "Prénom est requis"}),
    gender: z.union([z.string(), z.number()]),
    emailId: z.union([
        z.string().length(0),
        z.string().email({
            message: 'Entrer un email valid'
        })
    ]).optional().transform(e => e === "" ? undefined : e),
    birthDate: z.preprocess(
        (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined),
        z.date().refine((date) => !isNaN(date.getTime()), { message: "Date invalide" }),
    ),
    birthCity: z.string().min(1, {message: "Ville est requise"}),
    nationality: z.string().min(1, {message: "Nationalité est requise"}),
    dadName: z.string().min(1, {message: "Nom et prénom du père est requis"}),
    momName: z.string().min(1, {message: "Nom et prénom de la mère est requis"}),
    telephone: z.string().optional(),
    address: addressSchema,
    guardian: guardianSchema,
    healthCondition: healthSchema,
    image: z.string().optional(),
    school: z.string().optional()
})

export const enrollmentSchema = z.object({
    academicYear: z.string().min(1, {message: "L'année scolaire est requise"}),
    student: studentSchema,
    classe: classeSchema,
    school: z.string().optional()
})