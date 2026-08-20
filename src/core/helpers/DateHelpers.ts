import Datetime from "@/core/datetime.ts";
import {Moment} from "@/core/utils/interfaces.ts";
import {Day, WeekDay} from "@/entity/enums/day.ts";
import dayjs, {ManipulateType} from "dayjs";
import {
    CompoundOptions,
    DEFAULT_COMPOUND_LABELS, DEFAULT_DIRECTION_LABELS, DEFAULT_SIMPLE_LABELS, DirectionLabels, SimpleOptions,
    TimeAgoInput,
    TimeAgoOptions,
    UNIT_TO_DAYJS,
    UnitKey
} from "@/core/helpers/types.ts";
import {stringhelper} from "@/core/helpers/StringHelper.ts";

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

    applyDirection(value: string, isPast: boolean, direction: boolean | Partial<DirectionLabels>) {
        const resolved: DirectionLabels = {
            past: {
                ...DEFAULT_DIRECTION_LABELS.past,
                ...(typeof direction === 'object' ? direction.past : {})
            },
            future: {
                ...DEFAULT_DIRECTION_LABELS.future,
                ...(typeof direction === 'object' ? direction.future : {})
            }
        }

        const { prefix, suffix } = isPast ? resolved.past : resolved.future

        return [prefix, value, suffix].filter(Boolean).join(' ')
    }

    timeAgo (input: TimeAgoInput, options?: TimeAgoOptions): string {
        const showLabels = options?.showLabels ?? true
        const isUpper = options?.isUpper
        const then = Datetime.of(input)
        const now = options?.now ? Datetime.of(options?.now) : Datetime.now()

        const isPast = then.isBefore(now)
        const withDir = (s: string) => options?.direction
            ? this.applyDirection(s, isPast, options.direction)
            : s

        const formatLabel = (label: string)=> isUpper === undefined ? label : isUpper ? label?.toUpperCase() : label?.toLowerCase()
        const format = (x: number, label: string) => showLabels ? `${x} ${formatLabel(label)}` : `${x}`

        let result: string
        if (options?.compound) {
            const opts = options as CompoundOptions
            const units = opts.compound.split('-') as UnitKey[]
            const labels = {...DEFAULT_COMPOUND_LABELS, ...opts.labels}
            const separator = opts.separator ?? ' et '
            const skipZero = opts.skipZero ?? true

            const [start, end] = isPast ? [now, then] : [then, now]
            let current = start.clone()
            const parts: string[] = []

            for (const unit of units) {
                const value = end.diff(current, UNIT_TO_DAYJS[unit])
                if (!skipZero || value > 0) {
                    parts.push(format(value, labels[unit]))
                }
                if (value > 0) {
                    current = current.plus(value, UNIT_TO_DAYJS[unit])
                }
            }
            result = parts.join(separator) || format(0, labels[units[units.length - 1]]);
            return withDir(result)
        }

        const labels = {...DEFAULT_SIMPLE_LABELS, ...(options as SimpleOptions | undefined)?.labels}
        const seconds = Math.abs(now.diffSecond(then))
        const minutes = Math.abs(now.diffMinutes(then))
        const hours = Math.abs(now.diffHour(then))
        const days = Math.abs(now.diffDay(then))
        const weeks = Math.abs(now.diffWeek(then))
        const months = Math.abs(now.diffMonth(then))
        const years = Math.abs(now.diffYear(then))

        if (seconds < 60) result = format(seconds, labels.seconds)
        else if (minutes < 60) result = format(minutes, labels.minutes)
        else if (hours < 24) result = format(hours, labels.hours)
        else if (days < 7) result = format(days, stringhelper.setPlural({word: labels.days, count: days}))
        else if (weeks < 4) result = format(weeks, labels.weeks)
        else if (months < 12) result = format(months, labels.months)
        else result = format(years, stringhelper.setPlural({word: labels.years, count: years}))

        return withDir(result)
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