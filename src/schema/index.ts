import {z} from "zod";

export const inscriptionSchema = z.object({
    lastName: z.string().min(3, {
        message: "Nom de famille est requis"
    }),
    firstName: z.string().min(1, {
        message: "Prénom est requis"
    }),
    /*date: z.preprocess(
        (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined),
        z.date().refine((date) => !isNaN(date.getTime()), { message: "Invalid date" })
    ),*/
})