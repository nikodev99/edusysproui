import {z} from "zod";
import Datetime from "../core/datetime.ts";
import dayjs from "dayjs";

type TypicalErrors = {
    requiredError?: string,
    when?: {
        before?: boolean,
        after?: boolean
    }
    minError?: string,
    maxError?: string,
    regexError?: string,
}

/**
 * The `dateProcess` function is responsible for processing and validating a date input. It adjusts the input date by adding one hour,
 * validates its format, and ensures it meets specified conditions based on the `when` parameter, such as being before or after the current date.
 *
 * @param {string} requiredError - The custom error message displayed if a required date field is missing or invalid.
 * @param {Object} [when] - An optional parameter to specify additional constraints on the date.
 * @param {boolean} [when.before] - If true, the date must be in the past compared to the current date.
 * @param {boolean} [when.after] - If true, the date must be in the future compared to the current date.
 * @returns {z.ZodType} A Zod schema for validating the processed date.
 */
export const dateProcess = (requiredError: string, when?: {before?: boolean, after?: boolean}): z.ZodType  => z.preprocess(
    (arg) => {
        return arg ? Datetime.of(arg as string).plusHour(1).toDate() : undefined
    }, z.date({required_error: requiredError})
        .refine(date => !isNaN(date.getTime()), {message: 'Date invalide'})
        .refine(d => when?.before ? Datetime.of(d).isBefore(new Date()) : true, {
            message: 'La date doit être postérieure à maintenant'
        })
        .refine(d => when?.after ? Datetime.of(d).isAfter(new Date()) : true, {
            message: 'La date doit être antérieure à maintenant'
        })
)

export const timeProcess = (
    title: string,
    options?: {
        before?: boolean;
        after?: boolean;
        includeSeconds?: boolean;
    }
) => {
    const format = options?.includeSeconds ? 'HH:mm:ss' : 'HH:mm'

    /**
     * Single entry point: every accepted format → Datetime | undefined.
     * No more manual +1 hour: Datetime handles Africa/Brazzaville (UTC+1) internally.
     */
    const parse = (val: unknown): Datetime | undefined => {
        // number[] → [h, m] or [h, m, s]
        // covers: DB default, Datetime.now().TIME, Datetime.now().TIME_WITH_SECONDS
        if (Array.isArray(val) && val.length >= 2 && val.every(v => typeof v === 'number')) {
            return Datetime.timeToCurrentDate(val as number[])
        }
        // Dayjs → TimePicker value
        if (dayjs.isDayjs(val)) {
            return Datetime.of(val)  // tz conversion handled in _parse
        }
        // Native Date
        if (val instanceof Date && !isNaN(val.getTime())) {
            return Datetime.of(val)
        }
        // string "HH:mm" or "HH:mm:ss"
        if (typeof val === 'string' && /^\d{1,2}:\d{2}(:\d{2})?$/.test(val)) {
            return Datetime.timeToCurrentDate(val)
        }
        return undefined
    }

    return z.preprocess(
        // Treat empty/null/undefined as missing to trigger the required error
        (arg) => (arg === '' || arg === null || arg === undefined ? undefined : arg),

        z.unknown({required_error: title})
            // 1. Parse every accepted format into a Datetime
            .transform(parse)

            // 2. Required check
            .refine((d): d is Datetime => d instanceof Datetime, {
                message: title,
            })

            // 3. Before / after constraints — no arg = compare against now()
            .refine(
                (d) => (options?.before ? d.isBefore() : true),
                { message: 'La date doit être antérieure à maintenant' }
            )
            .refine(
                (d) => (options?.after ? d.isAfter() : true),
                { message: 'La date doit être postérieure à maintenant' }
            )

            // 4. Output: "HH:mm" or "HH:mm:ss"
            .transform((d) => d.format(format))
    )
}

export const excludeSpecialCharacters= (errors: TypicalErrors) =>
    z.string({required_error: errors.requiredError})
    .regex(/^[\p{Script=Latin}\d\s]+$/u, {message: errors.regexError})

export const utf8characterDigitExcluded = (errors: TypicalErrors) =>
    z.string({required_error: errors.requiredError})
        .regex(/^[a-zA-Zéèàîïùêâûòôäë\s-]+$/, {message: errors.regexError})
