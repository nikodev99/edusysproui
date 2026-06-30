import Datetime from "@/core/datetime.ts";
import {Moment} from "@/core/utils/interfaces.ts";

export class DateHelpers {
    formatWeekRange(weekDates: Datetime[]): string {
        if (!weekDates || weekDates.length === 0) return ""

        const start = weekDates[0]
        const end = weekDates[weekDates.length - 1]

        const sameMonth = start.isSameMonth(end.toDate())
        const sameYear = start.isSameYear(end.toDate())

        const startLabel = start.format('D MMM')
        const endLabel = end.format(sameMonth && sameYear ? 'D' : sameYear ? 'D MMM' : 'D MMM YYYY')

        if (sameMonth && sameYear) {
            return `${start.format('D')} - ${end.format('D MMM YYYY')}`
        }
        return `${startLabel} - ${endLabel}`
    }

    getDateReference(startDate?: Moment, endDate?: Moment) {
        const today = Datetime.now()
        if (!startDate || !endDate) return today
        if (today.isBetween(startDate, endDate)) return today
        if (today.isBefore(startDate)) return Datetime.of(startDate)
        if (today.isAfter(endDate)) return Datetime.of(endDate)
        return today
    }

    compareDay(reportDate: Datetime, givenDates: Moment[]) {
        return givenDates.some(gd => {
            const gdd = Datetime.of(gd)
            return gdd.DAY === reportDate.DAY
        })
    }

    toTimeArray(arg: unknown): number[] | string {
        if (Array.isArray(arg) && arg.length >= 2 && arg.length < 4) return arg;
        if (typeof arg === "string") return arg.split(":").map(Number);
        return "";
    }
}

export const datehelper = new DateHelpers()