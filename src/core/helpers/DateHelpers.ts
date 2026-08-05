import Datetime from "@/core/datetime.ts";
import {Moment} from "@/core/utils/interfaces.ts";
import {Day, WeekDay} from "@/entity/enums/day.ts";
import dayjs, {ManipulateType} from "dayjs";

const DEFAULT_LABELS = {
    seconds : 'sec.',
    minutes : 'min.',
    hours   : 'h',
    weeks   : 'sem.',
    months  : 'mois',
    years   : 'An',
} as const;

type LabelOverrides = Partial<typeof DEFAULT_LABELS>

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

    toTimeArray(timeInput: unknown): [number, number] {
        if (timeInput == null) return [0, 0]
        if (timeInput instanceof Date || dayjs.isDayjs(timeInput))
            return Datetime.of(timeInput).TIME as [number, number]

        if (typeof timeInput === 'string') {
            const [h, m] = timeInput.split(':').map(Number)
            return [h ?? 0, m ?? 0]
        }
        return [timeInput[0] ?? 0, timeInput[1] ?? 0]
    }

    duration(then: Moment, now: Moment, unit?: ManipulateType): number {
        return Datetime.of(then).diff(now, unit)
    }

    minDuration(then: Moment, now: Moment): number {
        return this.duration(then, now, 'minutes')
    }

    timeAgo (then: Moment, options?: {showLabels?: boolean, label?: LabelOverrides}): string {
        const showLabels = options?.showLabels ?? true
        const labels = {...DEFAULT_LABELS, ...options?.label}

        const now = Datetime.now()

        const seconds = Math.abs(now.diffSecond(then))
        const minutes = Math.abs(now.diffMinutes(then))
        const hours = Math.abs(now.diffHour(then))
        const weeks = Math.abs(now.diffWeek(then))
        const months = Math.abs(now.diffMonth(then))
        const years = Math.abs(now.diffYear(then))

        const format = (x: number, label: string) => showLabels ? `${x} ${label}` : `${x}`

        if (seconds < 60) return format(seconds, labels.seconds)
        if (minutes < 60) return format(minutes, labels.minutes)
        if (hours < 24) return format(hours, labels.hours)
        if (weeks < 4) return format(weeks, labels.weeks)
        if (months < 12) return format(months, labels.months)
        return format(years, years > 1 ? `${labels.years}s` : labels.years)
    }

    getWeekRange (now: Moment): {monday: Datetime, friday: Datetime} {
        const monday = Datetime.of(now).startOf('isoWeek')
        const friday = monday.plusDay(4).endOf('day')
        return {monday, friday}
    }

    getDates (dayOfWeek: WeekDay, timeInput: [number, number] | string, now: Moment) {
        const [hour, minute] = this.toTimeArray(timeInput)
        const {monday, friday} = this.getWeekRange(now)

        const day = Day[dayOfWeek]

        if (day === Day.ALL_DAYS) {
            const dates: Date[] = []
            let current = monday
            while (!current.isAfter(friday.toDate())) {
                dates.push(monday.timeToDatetime({time: [hour, minute]}).toDate())
                current = monday.plusDay(1)
            }
            return dates
        }

        return Array.from({ length: 6 }).map((_, index) => {
            const candidate = monday.plusDay(index);
            if (candidate.DAY === day + 1) {
                return candidate.timeToDatetime([hour, minute]).toDate()
            }
            return null;
        });
    }

    dateToDay (date: Moment): Day {
        const jsDay = Datetime.of(date).DAY
        return (jsDay === 0 ? Day.SUNDAY : jsDay - 1) as Day
    }
}

export const datehelper = new DateHelpers()