import dayjs, {Dayjs, ManipulateType} from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import 'dayjs/locale/fr.js'

dayjs.extend(utc)
dayjs.extend(timezone)

type DateInput = Date | number[] | string | number | Dayjs

//TODO Ajouter default timezone et locale aux sittings global
class Datetime {

    private date: Dayjs
    private timezone: string
    private readonly locale: string
    private static DEFAULT_TIMEZONE = 'Africa/Brazzaville'
    private static DEFAULT_LOCALE = 'fr'
    private static DEFAULT_FORMAT = 'YYYY-MM-DD'

    constructor(dateInput?: DateInput, timezone?: string, locale?: string) {
        this.timezone = timezone || Datetime.DEFAULT_TIMEZONE
        this.locale = locale || Datetime.DEFAULT_LOCALE
        if (!dateInput) {
            this.date = dayjs().tz(this.timezone).locale(this.locale)
        }else {
            this.date = this._parse(dateInput)
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
            return dayjs.unix(date).tz(this.timezone).locale(this.locale)
        }
        if (dayjs.isDayjs(date)) {
            return dayjs(date).tz(this.timezone).locale(this.locale)
        }

        throw new Error('Invalid date format')
    }

    static of(date: DateInput, timezone?: string, locale?: string): Datetime {
        return new Datetime(date, timezone, locale);
    }

    static now(date?: DateInput, timezone?: string, locale?: string): Datetime {
        return new Datetime(date, timezone, locale);
    }

    static timeToCurrentDate(time: number[]): Datetime {
        return Datetime.of(dayjs().hour(time[0]).minute(time[1]).second(0))
    }

    get YEAR(): number {
        return this.date.year();
    }

    get MONTH(): number {
        return this.date.month() + 1;
    }

    get DAY(): number {
        return this.date.date();
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

    toDate(): Date {
        return this.date.toDate();
    }

    toDayjs(format?: string): Dayjs {
        return dayjs(this.date, format)
    }

    minus(value: number, unit: ManipulateType): this {
        this.date = this.date.subtract(value, unit)
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

    plus(value: number, unit: ManipulateType): this {
        this.date = this.date.add(value, unit)
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

    diff(dateInput: DateInput, unit: ManipulateType, timezone?: string, locale?: string): number {
        const dateToDiff = new Datetime(dateInput, timezone, locale)
        return  dateToDiff.date.diff(this.date, unit)
    }

    diffYear(date: DateInput, timezone?: string, locale?: string): number {
        return this.diff(date, 'year', timezone, locale);
    }

    diffMonth(date: DateInput, timezone?: string, locale?: string): number {
        return this.diff(date, 'month', timezone, locale);
    }

    diffDay(date: DateInput, timezone?: string, locale?: string): number {
        return this.diff(date, 'day', timezone, locale);
    }

    diffHour(date: DateInput, timezone?: string, locale?: string): number {
        return this.diff(date, 'hour', timezone, locale);
    }

    diffMinutes(date: DateInput, timezone?: string, locale?: string): number {
        return this.diff(date, 'minute', timezone, locale);
    }

    diffSecond(date: DateInput, timezone?: string, locale?: string): number {
        return this.diff(date, 'second', timezone, locale);
    }

    diffWeek(date: DateInput, timezone?: string, locale?: string): number {
        return this.diff(date, 'week', timezone, locale);
    }

    format(format?: string): string {
        return this.date.format(format ?? Datetime.DEFAULT_FORMAT);
    }

    fDatetime(format?: string, to?: boolean): string {
        return this.format(format || (to ? 'DD/MM/YYYY à HH:mm' : 'DD/MM/YYYY HH:mm'))
    }

    fDate(format?: string): string {
        return this.format(format ?? 'DD MMMM YYYY')
    }

    fullDay() {
        return this.format('dddd D MMMM YYYY')
    }

    isAfter(date: DateInput): boolean {
        const otherDate = new Datetime(date).date;
        return this.date.isAfter(otherDate);
    }

    isBefore(date: DateInput): boolean {
        const otherDate = new Datetime(date).date;
        return this.date.isBefore(otherDate);
    }

    compare(date: DateInput): -1 | 1 | 0 {
        if (this.isBefore(date)) return -1
        if (this.isAfter(date)) return 1
        if (this.isSame(date)) return 0
        throw new Error('Invalid date')
    }

    timeToDatetime(time: number[]): this {
        this.date = this.date.hour(time[0]).minute(time[1]).second(0)
        return this
    }

    isCurrentTimeBetween(statTime: number[], endTime: number[]): boolean {
        const date1 = this.timeToDatetime(statTime)
        const date2 = this.timeToDatetime(endTime)
        return this.isAfter(date1.date) && this.isBefore(date2.date)
    }

    isSame(dateInput: DateInput, timezone?: string, locale?: string) {
        const date = new Datetime(dateInput, timezone, locale)
        return this.date.isSame(date.date)
    }

    isValid(): boolean {
        return this.date.isValid()
    }

}

export  default Datetime
