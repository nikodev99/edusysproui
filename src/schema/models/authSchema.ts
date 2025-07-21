import {z} from "zod";

export const loginSchema = z.object({
    username: z.string({required_error: 'Le nom d\'utilisateur est requis'})
        .min(3, {message: "Le nom d'utilisateur doit contenir au moins trois characters"})
        .max(50, {message: "Le nom d'utilisateur doit contenir au plus 50 characters"}),
    password: z.string({required_error: 'Le mot de passe est requis'})
        .min(6, {message: "Le mot de passe doit contenir au moins 6 characters"})
        .max(50, {message: "Le mot de passe doit contenir au plus 50 characters"})
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
            message: "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial."
        })
})

export const userSchoolRoleSchema = z.object({
    schoolId: z.string().optional(),
    roles: z.array(z.string()).optional(),
})

export const signupSchema = z.object({
    username: z.string({required_error: 'Le nom d\'utilisateur est requis'})
        .min(3, {message: "Le nom d'utilisateur doit contenir au moins 3 characters"})
        .max(50, {message: "Le nom d'utilisateur doit contenir au plus 50 characters"})
        .regex(/^[a-zA-Z0-9_]+$/, {
            message: "Le nom d'utilisateur ne peut contenir que des caractères alphanumériques et des underscores"
        }),
    password: z.string({required_error: 'Le mot de passe est requis'})
        .min(6, {message: "Le mot de passe doit contenir au moins 6 characters"})
        .max(100, {message: "Le mot de passe doit contenir au plus 100 characters"})
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
            message: "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial."
        }),
    passwordConfirm: z.string({ required_error: 'La confirmation du mot de passe est requise' }),
    email: z.string()
        .email({message: "Veuillez fournir une adresse email valide"})
        .min(5, {message: "L'email doit contenir au moins 5 characters"})
        .max(254, {message: "L'email doit contenir au plus 254 characters"})
        .optional(),
    phoneNumber: z.string()
        .regex(/^[+]?[0-9]{9,15}$/, {
            message: "Veuillez fournir un numéro de téléphone valide"
        })
        .optional(),
    personalInfoId: z.number().optional(),
    roles: userSchoolRoleSchema.optional(),
    userType: z.number(),
}).refine((data) => data.password === data.passwordConfirm, {
    message: "Les mots de passe ne correspondent pas",
    path: ['passwordConfirm']
})

export const logoutSchema = z.object({
    refreshToken: z.string()
})