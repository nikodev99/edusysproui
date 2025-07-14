import {z} from "zod";
import Datetime from "../core/datetime.ts";
import dayjs from "dayjs";

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
        return Datetime.of(arg as string).plusHour(1).toDate()
    }, z.date({required_error: requiredError})
        .refine(date => (isNaN(date.getDate()) || !!date), {message: 'Date invalide'})
        .refine(d => when?.before ? Datetime.of(d).isBefore(new Date()) : true, {
            message: 'La date doit être postérieure à maintenant'
        })
        .refine(d => when?.after ? Datetime.of(d).isAfter(new Date()) : true, {
            message: 'La date doit être antérieure à maintenant'
        })
)

export const timeProcess = (title: string) =>
    z.preprocess((arg) => {
        if (arg === null || arg === undefined || arg === "") {
            return arg;
        }

        if (dayjs.isDayjs(arg) || (arg instanceof Date && !isNaN(arg.getTime()))) {
            return Datetime.of(arg).format("HH:mm");
        }
        return arg;
    }, z.string({ required_error: title }));
