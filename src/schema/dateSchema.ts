import {z} from "zod";
import Datetime from "../core/datetime.ts";
import dayjs from "dayjs";

export const dateProcess = (requiredError: string, when?: {before?: boolean, after?: boolean})  => z.preprocess(
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
