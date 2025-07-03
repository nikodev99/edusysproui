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

export const logoutSchema = z.object({
    refreshToken: z.string()
})