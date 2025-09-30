import dayjs, {Dayjs, ManipulateType} from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import 'dayjs/locale/fr.js'
import {setFirstName} from "./utils/utils.ts";

dayjs.extend(utc)
dayjs.extend(timezone)

type DateInput = Date | number[] | string | number | Dayjs
type Params = {
    date?: DateInput
    timezone?: string
    locale?: string
    format?: string
    to?: boolean
    time?: number[]
    statTime?: number[]
    endTime?: number[]
    unit?: ManipulateType
}

export function isParams(arg: unknown): arg is Params {
    if (!arg || typeof arg !== 'object' || Array.isArray(arg) || dayjs.isDayjs(arg)) {
        return false;
    }

    // Check if at least one of the Params keys exists
    return (
        'date' in arg ||
        'timezone' in arg ||
        'locale' in arg ||
        'format' in arg ||
        'to' in arg ||
        'time' in arg ||
        'statTime' in arg ||
        'endTime' in arg ||
        'unit' in arg
    );
}

/**
 * Converts the provided argument into an array of numbers representing time.
 *
 * Depending on the type of the input argument, the method processes it as follows:
 * - If the argument is an array, it is returned directly.
 * - If the argument is a string, it is split by colons and the resulting parts are converted to numbers.
 *
 * @param {unknown} arg The input value to convert. It can be an array or a colon-separated string.
 * @return {number[]} The array of numbers representing time components. Returns the input directly if it is already an array. For strings, returns the numeric components as an array.
 */
export function toTimeArray(arg: unknown): number[] | string {
    if (Array.isArray(arg)) {
        return arg
    }

    if (typeof arg === 'string') {
        return arg.split(':').map(Number)
    }

    return ''
}

//TODO Ajouter default timezone et locale aux sittings global
class Datetime {

    private date: Dayjs
    private timezone: string
    private readonly locale: string
    private static DEFAULT_TIMEZONE = 'Africa/Brazzaville'
    private static DEFAULT_LOCALE = 'fr'
    private static DEFAULT_FORMAT = 'YYYY-MM-DD'

    constructor(input?: DateInput | Params, timezone?: string, locale?: string) {
        let dateInput: DateInput | undefined;
        if (isParams(input)) {
            dateInput = input.date;
            this.timezone = input.timezone || Datetime.DEFAULT_TIMEZONE;
            this.locale = input.locale || Datetime.DEFAULT_LOCALE;
        } else {
            dateInput = input;
            this.timezone = timezone || Datetime.DEFAULT_TIMEZONE;
            this.locale = locale || Datetime.DEFAULT_LOCALE;
        }

        if (!dateInput) {
            this.date = dayjs().tz(this.timezone).locale(this.locale);
        } else {
            this.date = this._parse(dateInput);
        }
    }

    private _parse(date: DateInput = new Date()): Dayjs {
        if (typeof date === "string") {
            return dayjs(date).tz(this.timezone).locale(this.locale)
        }
        if (date instanceof Date) {
            return dayjs(date).tz(this.timezone).locale(this.locale)
        }
        if (Array.isArray(date)) {
            switch (date?.length) {
                case 3: {
                    const [year, month, day] = date
                    return dayjs(new Date(year, month - 1, day, 0, 0)).tz(this.timezone).locale(this.locale)
                }
                case 6: {
                    const [year, month, day, hour, minute, second] = date
                    return dayjs(new Date(year, month - 1, day, hour, minute, second)).tz(this.timezone).locale(this.locale)
                }
            }
        }
        if (typeof date === "number") {
            const d = date > 1e12
                ? dayjs(date)       // interprets `date` as ms
                : dayjs.unix(date); // interprets `date` as s

            return d.tz(this.timezone).locale(this.locale);
        }
        if (dayjs.isDayjs(date)) {
            return dayjs(date).tz(this.timezone).locale(this.locale)
        }

        throw new Error('Invalid date format')
    }

    static of(date: DateInput | Params, timezone?: string, locale?: string): Datetime {
        return new Datetime(date, timezone, locale);
    }

    static now(date?: DateInput | Params, timezone?: string, locale?: string): Datetime {
        return new Datetime(date, timezone, locale);
    }

    static timeToCurrentDate(time: number[] | string | Params): Datetime {
        const t = isParams(time) ? time.time as number[] : toTimeArray(time)
        if (Array.isArray(t) && t.length >= 2) {
            return Datetime.of(dayjs().hour(t[0])?.minute(t[1] || 0)?.second(0))
        }else {
            return Datetime.of(t)
        }
    }

    get YEAR(): number {
        return this.date.year();
    }

    get MONTH(): number {
        return this.date.month() + 1;
    }

    get DATE(): number {
        return this.date.date();
    }

    get DAY(): number {
        return this.date.day()
    }

    get DAY_NAME(): string {
        return this.date.format('dddd')
    }

    get HOUR(): number {
        return this.date.hour();
    }

    get MINUTE(): number {
        return this.date.minute();
    }

    get SECOND(): number {
        return this.date.second();
    }

    get MILLISECOND(): number {
        return this.date.millisecond();
    }

    get TIMESTAMP(): number {
        return this.date.valueOf();
    }
    get UNIX(): number {
        return this.date.unix()
    }

    toDate(): Date {
        return this.date.toDate();
    }

    toDayjs(format?: string | Params): Dayjs {
        const f = isParams(format) ? format.format : format
        return dayjs(this.date, f)
    }

    minus(value: number, unit: ManipulateType | Params): this {
        const u = isParams(unit) ? unit.unit : unit
        this.date = this.date.subtract(value, u)
        return this
    }

    minusYear(value: number): this {
        return this.minus(value, 'year');
    }

    minusMonth(value: number): this {
        return this.minus(value, 'month');
    }

    minusDay(value: number): this {
        return this.minus(value, 'day');
    }

    minusHour(value: number): this {
        return this.minus(value, 'hour');
    }

    minusMinutes(value: number): this {
        return this.minus(value, 'minute');
    }

    minusSeconds(value: number): this {
        return this.minus(value, 'second');
    }

    minusWeek(value: number): this {
        return this.minus(value, 'week');
    }

    plus(value: number, unit: ManipulateType | Params): this {
        const u = isParams(unit) ? unit.unit : unit
        this.date = this.date.add(value, u)
        return this
    }

    plusYear(value: number): this {
        return this.plus(value, 'year');
    }

    plusMonth(value: number): this {
        return this.plus(value, 'month');
    }

    plusDay(value: number): this {
        return this.plus(value, 'day');
    }

    plusHour(value: number): this {
        return this.plus(value, 'hour');
    }

    plusMinutes(value: number): this {
        return this.plus(value, 'minute');
    }

    plusSecond(value: number): this {
        return this.plus(value, 'second');
    }

    plusWeek(value: number): this {
        return this.plus(value, 'week');
    }

    diff(dateInput: DateInput | Params, unit?: ManipulateType, timezone?: string, locale?: string): number {
        const dateToDiff = new Datetime(dateInput, timezone, locale)
        return  dateToDiff.date.diff(this.date, isParams(dateInput) ? dateInput.unit ?? unit : unit)
    }

    diffYear(date: DateInput | Params, timezone?: string, locale?: string): number {
        return Math.ceil(this.diff(date, 'year', timezone, locale));
    }

    diffMonth(date: DateInput | Params, timezone?: string, locale?: string): number {
        return Math.ceil(this.diff(date, 'month', timezone, locale));
    }

    diffDay(date: DateInput | Params, timezone?: string, locale?: string): number {
        return Math.ceil(this.diff(date, 'day', timezone, locale));
    }

    diffHour(date: DateInput | Params, timezone?: string, locale?: string): number {
        return Math.ceil(this.diff(date, 'hour', timezone, locale));
    }

    diffMinutes(date: DateInput | Params, timezone?: string, locale?: string): number {
        return Math.ceil(this.diff(date, 'minute', timezone, locale));
    }

    diffSecond(date: DateInput | Params, timezone?: string, locale?: string): number {
        return Math.ceil(this.diff(date, 'second', timezone, locale));
    }

    diffWeek(date: DateInput | Params, timezone?: string, locale?: string): number {
        return Math.ceil(this.diff(date, 'week', timezone, locale));
    }

    format(format?: string | Params): string {
        const f = (isParams(format) ? format.format : format) ?? Datetime.DEFAULT_FORMAT
        return setFirstName(this.date.format(f));
    }

    fDatetime(format?: string | Params, to?: boolean): string {
        const f = isParams(format) ? format.format : format
        const defaultFormat = isParams(format) ? 
            format.to ? 'DD/MM/YYYY à HH:mm' : 'DD/MM/YYYY HH:mm':
            to ? 'DD/MM/YYYY à HH:mm' : 'DD/MM/YYYY HH:mm'

        return setFirstName(this.format(f || defaultFormat))
    }

    fDate(format?: string | Params): string {
        return setFirstName(this.format(format ?? 'DD MMMM YYYY'))
    }

    time(format?: string | Params): string {
        return setFirstName(this.format(format ?? 'HH:mm'))
    }

    fullDay() {
        return setFirstName(this.format('dddd D MMMM YYYY'))
    }

    isAfter(date: DateInput | Params): boolean {
        const otherDate = new Datetime(date).date;
        return this.date.isAfter(otherDate);
    }

    isBefore(date: DateInput | Params): boolean {
        const otherDate = new Datetime(date).date;
        return this.date.isBefore(otherDate);
    }

    isBetween(startDate: DateInput | Params, endDate: DateInput | Params): boolean {
        return this.isAfter(startDate) && this.isBefore(endDate)
    }

    compare(date: DateInput | Params): -1 | 1 | 0 {
        if (this.isBefore(date)) return -1
        if (this.isAfter(date)) return 1
        if (this.isSame(date)) return 0
        throw new Error('Invalid date')
    }

    timeToDatetime(time: number[] | Params): this {
        const t = isParams(time) ? time.time as number[] : time
        this.date = this.date.hour(t[0]).minute(t[1]).second(0)
        return this
    }

    isCurrentTimeBetween(startTime: number[] | Params, endTime?: number[]): boolean {
        const {start, end} = isParams(startTime) ? 
            {start: startTime.statTime, end: startTime.endTime} : 
            {start: startTime, end: endTime} 
        const date1 = this.timeToDatetime(start as number[])
        const date2 = this.timeToDatetime(end as number[])
        return this.isAfter(date1.date) && this.isBefore(date2.date)
    }

    isSame(dateInput: DateInput | Params, unit?: ManipulateType, timezone?: string, locale?: string) {
        const date = new Datetime(dateInput, timezone, locale)
        const customUnit = unit || (isParams(dateInput) ? dateInput?.unit : undefined)
        return this.date.isSame(date.date, customUnit)
    }

    isValid(): boolean {
        return this.date.isValid()
    }

}

export  default Datetime
