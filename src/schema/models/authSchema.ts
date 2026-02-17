import {z} from "zod";

class PasswordGenerator {
    private UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private LOWER = "abcdefghijklmnopqrstuvwxyz";
    private DIGITS = "0123456789";
    private SPECIAL = "@$!%*?&";

    getRandomInt(min: number, max: number) {
        const range = max - min + 1
        if (typeof globalThis.cripto?.getRandomValues === "function") {
            const rand = new Uint32Array(1)
            globalThis.cripto.getRandomValues(rand)
            return min + (rand[0] % range)
        }
        return min + Math.floor(Math.random() * range)
    }

    shuffle<T>(arr: T[]): T[] {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = this.getRandomInt(0, i)
            const temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }
        return arr
    }

    generatePassword(length?: number): string {
        const [min, max] = [6, 10]
        const finalLength = (() => {
            if (length === undefined) return this.getRandomInt(min, max)
            if (!Number.isInteger(length)) throw new TypeError("Length must be an integer")
            if (length < min || length > max) throw new RangeError("Length must be between 6 and 10")
            return length
        })()

        const resultChars: string[] = [
            this.UPPER[this.getRandomInt(0, this.UPPER.length - 1)],
            this.LOWER[this.getRandomInt(0, this.LOWER.length - 1)],
            this.DIGITS[this.getRandomInt(0, this.DIGITS.length - 1)],
            this.SPECIAL[this.getRandomInt(0, this.SPECIAL.length - 1)],
        ]

        const all = this.UPPER + this.LOWER + this.DIGITS + this.SPECIAL

        while(resultChars.length < finalLength) {
            resultChars.push(all[this.getRandomInt(0, all.length - 1)])
        }

        return this.shuffle(resultChars).join("")
    }

    isValidStrongString(s: string): boolean {
        if (s.length < 6 || s.length > 10) return false;
        // at least one of each category
        return /[A-Z]/.test(s) &&
            /[a-z]/.test(s) &&
            /[0-9]/.test(s) &&
            /[!@#$%^&*()-_=+{}|;:,.<>?/]/.test(s);
    }
}

export const passwordGenerator = new PasswordGenerator()
const samePassword = '@Toto99'//passwordGenerator.generatePassword()

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
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{}|;:,.<>?/])[A-Za-z\d!@#$%^&*()-_=+{}|;:,.<>?/]{6,100}$/, {
            message: "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial."
        }).optional().default(samePassword),
    passwordConfirm: z.string({ required_error: 'La confirmation du mot de passe est requise' })
        .optional().default(passwordGenerator.generatePassword()),
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

export const assignUserToSchoolSchema = z.object({
    userId: z.number().optional(),
    schoolId: z.string().uuid(),
    roles: z.array(z.string()),
})