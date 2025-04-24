import {z} from "zod";
import Datetime from "../core/datetime.ts";
import dayjs from "dayjs";

export const dateProcess = (requiredError: string)  => z.preprocess(
    (arg) => {
        return Datetime.of(arg as string).plusHour(1).toDate()
    }, z.date({required_error: requiredError}).refine(date => !!date, {message: 'Date invalid'})
)

export const timeProcess = (title: string) => z.preprocess(
    (arg) => {
        if (!arg) return ''
        if (dayjs.isDayjs(arg) || typeof arg === "string")
            return Datetime.of(arg).format("HH:mm")
    }, z.string({required_error: title})
)