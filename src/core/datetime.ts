import dayjs, { Dayjs, ManipulateType } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"; // FIX: was isSameOfAfter (typo)
import isoWeek from "dayjs/plugin/isoWeek";
import "dayjs/locale/fr.js";
import { setFirstName } from "./utils/utils.ts";
import { Moment } from "@/core/utils/interfaces.ts";
import {datehelper} from "@/core/helpers/DateHelpers.ts";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isTomorrow);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter); // FIX: was isSameOfAfter (typo in original)
dayjs.extend(isoWeek);
dayjs.tz.setDefault('Africa/Brazzaville')

type DateInput = Moment | Dayjs | Datetime;

/**
 * Common date format patterns — French (fr-FR) conventions:
 * day-month-year order, 24h time, and locale-dependent tokens
 * (MMMM/EEEE) rendered in French when you pass { locale: fr } (date-fns)
 * or call dayjs.locale("fr") / moment.locale("fr") beforehand.
 * Tokens are compatible with date-fns, dayjs (with plugins), and moment.js.
 */
export enum DateFormat {
    // ISO (locale-independent, use for storage/APIs)
    ISO_DATE = "YYYY-MM-DD",                      // 2026-07-25
    ISO_DATETIME = "YYYY-MM-DD'T'HH:mm:ss",        // 2026-07-25T14:30:00
    ISO_DATETIME_MS = "YYYY-MM-DD'T'HH:mm:ss.SSS", // 2026-07-25T14:30:00.000
    ISO_DATETIME_TZ = "YYYY-MM-DD'T'HH:mm:ssXXX",  // 2026-07-25T14:30:00+01:00

    // Date only - numeric (jour/mois/année)
    DATE_SLASH = "DD/MM/YYYY",                     // 25/07/2026
    DATE_DASH = "DD-MM-YYYY",                      // 25-07-2026
    DATE_DOT = "DD.MM.YYYY",                       // 25.07.2026
    DATE_COMPACT = "YYYYMMdd",                     // 20260725
    DATE_SHORT_YEAR = "dd/MM/yy",                   // 25/07/26

    // Date only - written out (needs French locale set on the library)
    DATE_LONG = "D MMMM YYYY",                     // 25 juillet 2026
    DATE_MEDIUM = "D MMM YYYY",                    // 25 juil. 2026
    DATE_SHORT_WEEKDAY = "ddd D MMM YYYY",          // ven. 25 juil. 2026
    DATE_FULL_WEEKDAY = "dddd D MMMM YYYY",         // vendredi 25 juillet 2026

    // Time only (24h, standard in France)
    TIME = "HH:mm",                                // 14:30
    TIME_SEC = "HH:mm:ss",                         // 14:30:00
    TIME_H_SUFFIX = "HH'h'mm",                     // 14h30

    // Date + time combined
    DATETIME_SLASH = "DD/MM/YYYY HH:mm",           // 25/07/2026 14:30
    DATETIME_SLASH_TO = "DD/MM/YYYY à HH:mm",       // 25/07/2026 à 14:30
    DATETIME_SLASH_SEC = "DD/MM/YYYY HH:mm:ss",     // 25/07/2026 14:30:00
    DATETIME_MEDIUM = "D MMM YYYY 'à' HH:mm",       // 25 juil. 2026 à 14:30
    DATETIME_FULL = "dddd D MMMM YYYY 'à' HH:mm:ss",// vendredi 25 juillet 2026 à 14:30:00

    // Month / year only
    MONTH_YEAR = "MMMM YYYY",                      // juillet 2026
    MONTH_YEAR_SHORT = "MMM YYYY",                 // juil. 2026
    YEAR_MONTH_NUMERIC = "YYYY-MM",                // 2026-07

    // File-safe / log formats
    FILENAME_TIMESTAMP = "YYYYMMDD_HHmmss",        // 20260725_143000
    LOG_TIMESTAMP = "YYYY-MM-DD HH:mm:ss.SSS",     // 2026-07-25 14:30:00.000
}

type Params = {
    date?: DateInput;
    timezone?: string;
    locale?: string;
    format?: string | DateFormat;
    to?: boolean;
    time?: number[];
    startTime?: number[]; // FIX: was statTime (typo in original)
    endTime?: number[];
    unit?: ManipulateType;
};

export function isParams(arg: unknown): arg is Params {
    if (!arg || typeof arg !== "object" || Array.isArray(arg) || dayjs.isDayjs(arg)) {
        return false;
    }
    return (
        "date" in arg ||
        "timezone" in arg ||
        "locale" in arg ||
        "format" in arg ||
        "to" in arg ||
        "time" in arg ||
        "startTime" in arg || // FIX: was statTime
        "endTime" in arg ||
        "unit" in arg
    );
}

// ─────────────────────────────────────────────────────────────────────────────

class Datetime {
    private date: Dayjs;
    private readonly timezone: string;
    private readonly locale: string;
    public static readonly DEFAULT_TIMEZONE = "Africa/Brazzaville";
    private static readonly DEFAULT_LOCALE = "fr";
    private static readonly DEFAULT_FORMAT = DateFormat.ISO_DATE;

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

        this.date = dateInput ? this._parse(dateInput) : dayjs().tz(this.timezone).locale(this.locale);
    }

    // ── Private: create a new Datetime from a raw Dayjs (no reparsing) ──────
    //   This is the core of immutability: all manipulation methods call _clone
    //   instead of mutating this.date in place.
    private _clone(d: Dayjs): Datetime {
        return Datetime._fromDayjs(d, this.timezone, this.locale);
    }

    private static _fromDayjs(d: Dayjs, tz: string, locale: string): Datetime {
        const instance = new Datetime(undefined, tz, locale);
        instance.date = d;
        return instance;
    }

    /**
     * Parses the provided date input and returns a Dayjs instance adjusted to the specified timezone and locale.
     *
     * @param {DateInput} date - The date to be parsed. Can be a `string`, `Date` object, an array representing date components,
     * a timestamp in milliseconds or seconds, or a Dayjs instance.
     * @return {Dayjs} A Dayjs instance representing the parsed date, adjusted to the configured timezone and locale.
     * @throws {Error} Throws an error if the date format is invalid or unsupported.
     */
    private _parse(date: DateInput): Dayjs {
        if (typeof date === "string") {
            return dayjs.tz(date, this.timezone).locale(this.locale);
        }
        if (date instanceof Datetime) {
            return date.toDayjs()
        }
        if (date instanceof Date) {
            return dayjs(date).tz(this.timezone).locale(this.locale);
        }
        if (Array.isArray(date)) {
            switch (date.length) {
                case 3: {
                    const [year, month, day] = date;
                    const s = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    return dayjs.tz(s, this.timezone).locale(this.locale);
                }
                case 6: {
                    const [year, month, day, hour, minute, second] = date;
                    return dayjs(new Date(year, month - 1, day, hour, minute, second))
                        .tz(this.timezone)
                        .locale(this.locale);
                }
            }
        }
        if (typeof date === "number") {
            const d = date > 1e12 ? dayjs(date) : dayjs.unix(date);
            return d.tz(this.timezone).locale(this.locale);
        }
        if (dayjs.isDayjs(date)) {
            return dayjs(date).tz(this.timezone).locale(this.locale);
        }
        throw new Error("Invalid date format");
    }

    // ── Static factories ──────────────────────────────────────────────────────

    /**
     * Creates a new instance of the Datetime class using the provided date, timezone, and locale values.
     *
     * @param {DateInput | Params} date - The input date or parameters to initialize the Datetime instance.
     * @param {string} [timezone] - Optional. The timezone to use for the Datetime instance.
     * @param {string} [locale] - Optional. The locale to apply to the Datetime instance.
     * @return {Datetime} A new Datetime instance initialized with the specified values.
     */
    static of(date: DateInput | Params, timezone?: string, locale?: string): Datetime {
        return new Datetime(date, timezone, locale);
    }

    /**
     * Creates a new `Datetime` instance representing the current date and time.
     *
     * @param {string} [timezone] - The timezone to use for the new `Datetime` instance. If omitted, the default timezone is used.
     * @param {string} [locale] - The locale to use for the new `Datetime` instance. If omitted, the default locale is used.
     * @return {Datetime} A `Datetime` instance representing the current date and time.
     */
    static now(timezone?: string, locale?: string): Datetime {
        return new Datetime(undefined, timezone, locale);
    }

    /**
     * Converts the provided time to a `Datetime` object representing the current date with the given time applied.
     *
     * @param {number[] | string | Params} time - The input time which can be a number array, string, or `Params` object.
     * For an array, the format is `[hour, minute, second(optional)]`.
     * For a `Params` object, it should have a `time` property as a number array.
     * For a string, it is parsed into a time array using `datehelper.toTimeArray`.
     * @return {Datetime} A `Datetime` object with the provided time applied to the current date, or the current date and time if the input is invalid.
     */
    static timeToCurrentDate(time: number[] | string | Params): Datetime {
        const t = isParams(time) ? (time.time as number[]) : datehelper.toTimeArray(time)
        if (Array.isArray(t) && t.length >= 2) {
            const [h, m, s = 0] = t
            return Datetime.of(dayjs().hour(h).minute(m).second(s))
        }
        return Datetime.now()
    }

    /**
     * Returns 6 Datetime instances (Mon–Sat) for the ISO week at `offset` weeks
     * from today.
     *
     * FIX: All three original bugs are resolved here:
     *   1. startOf('isoWeek') result is now properly captured (via immutable _clone)
     *   2. plusDay(i) returns a NEW Datetime each time → no shared-mutation issue
     *   3. No need for manual dow arithmetic — isoWeek plugin handles it
     */
    static getWeekDates(offset: number = 0, referencedDate?: DateInput): Datetime[] {
        const date = referencedDate ? Datetime.of(referencedDate) : Datetime.now()
        const monday = date.startOf("isoWeek").plusWeek(offset);
        return Array.from({ length: 6 }, (_, i) => monday.plusDay(i));
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    get YEAR(): number        { return this.date.year(); }
    get MONTH(): number       { return this.date.month() + 1; }
    get MONTH_NAME(): string  { return this.date.format("MMMM"); }
    get MONTH_SHORT_NAME(): string { return this.date.format("MMM"); }
    get DATE(): number        { return this.date.date(); }
    get DAY(): number         { return this.date.day(); }
    get ISO_DAY(): number     { return this.date.isoWeekday(); } // 1=Mon … 7=Sun
    get DAY_NAME(): string    { return this.date.format("dddd"); }
    get HOUR(): number        { return this.date.hour(); }
    get MINUTE(): number      { return this.date.minute(); }
    get SECOND(): number      { return this.date.second(); }
    get TIME(): [number, number] | number[] {return [this.date.hour(), this.date.minute()]}
    get TIME_WITH_SECONDS(): number[] {
        return [this.date.hour(), this.date.minute(), this.date.second()]
    }
    get MILLISECOND(): number { return this.date.millisecond(); }
    get TIMESTAMP(): number   { return this.date.valueOf(); }
    get UNIX(): number        { return this.date.unix(); }

    // ── Conversion ────────────────────────────────────────────────────────────

    toDate(): Date  { return this.date.toDate(); }
    toDayjs(): Dayjs { return this.date; } // FIX: removed unused format arg (dayjs(Dayjs, format) is not valid
    clone(): Datetime {
        return new Datetime(this.date)
    }

    // ── Immutable boundary snapping ───────────────────────────────────────────
    //
    // FIX (critical): the original methods called this.date.startOf() but never
    // assigned the result back, so they were silent no-ops. They also returned
    // `this` (mutating), which caused side effects in isSameOrBefore, isStrictBefore,
    // etc. All now return a NEW Datetime via _clone.

    startOf(unit: ManipulateType | "isoWeek"): Datetime {
        return this._clone(this.date.startOf(unit as ManipulateType));
    }

    /** @deprecated use startOf(unit) */
    strict(unit: ManipulateType): Datetime {
        return this.startOf(unit)
    }

    /** @deprecated use startOf('isoWeek') or strictIsoWeek() */
    isoWeek(): Datetime {
        return this.startOf('isoWeek')
    }

    endOf(unit: ManipulateType | "isoWeek"): Datetime {
        return this._clone(this.date.endOf(unit as ManipulateType));
    }

    /** @alias startOf('day') */
    strictDay(): Datetime { return this.startOf("day"); }

    /** @alias startOf('isoWeek') */
    strictIsoWeek(): Datetime { return this.startOf("isoWeek"); }

    // ── Immutable arithmetic ──────────────────────────────────────────────────
    //
    // FIX (critical): the original mutated this.date and returned `this`, meaning
    // all callers shared the same mutated object. Chaining worked by accident on
    // single chains but broke completely in loops (see getWeekDates bug).

    minus(value: number, unit: ManipulateType | Params): Datetime {
        const u = isParams(unit) ? unit.unit : unit;
        return this._clone(this.date.subtract(value, u!));
    }

    minusYear(value: number): Datetime    { return this.minus(value, "year"); }
    minusMonth(value: number): Datetime   { return this.minus(value, "month"); }
    minusDay(value: number): Datetime     { return this.minus(value, "day"); }
    minusHour(value: number): Datetime    { return this.minus(value, "hour"); }
    minusMinutes(value: number): Datetime { return this.minus(value, "minute"); }
    minusSeconds(value: number): Datetime { return this.minus(value, "second"); }
    minusWeek(value: number): Datetime    { return this.minus(value, "week"); }
    yesterday(): Datetime                 { return this.minus(1, "day"); }

    plus(value: number, unit: ManipulateType | Params): Datetime {
        const u = isParams(unit) ? unit.unit : unit;
        return this._clone(this.date.add(value, u!));
    }

    plusYear(value: number): Datetime    { return this.plus(value, "year"); }
    plusMonth(value: number): Datetime   { return this.plus(value, "month"); }
    plusDay(value: number): Datetime     { return this.plus(value, "day"); }
    plusHour(value: number): Datetime    { return this.plus(value, "hour"); }
    plusMinutes(value: number): Datetime { return this.plus(value, "minute"); }
    plusSecond(value: number): Datetime  { return this.plus(value, "second"); }
    plusWeek(value: number): Datetime    { return this.plus(value, "week"); }
    tomorrow(): Datetime                 { return this.plus(1, "day"); }

    // ── Time overlay ──────────────────────────────────────────────────────────
    //
    // FIX: original mutated this.date, so calling it twice on the same instance
    // produced wrong results (isCurrentTimeBetween was comparing date2 vs. date2).

    timeToDatetime(time: number[] | Params): Datetime {
        const t = isParams(time) ? datehelper.toTimeArray(time.time as number[]) : datehelper.toTimeArray(time);
        return this._clone(this.date.hour(t[0]).minute(t[1]).second(0).millisecond(0));
    }

    // ── Diff ──────────────────────────────────────────────────────────────────
    // Defaulting to now() means: "how far is this instance from the current moment"

    diff(dateInput?: DateInput | Params, unit?: ManipulateType, timezone?: string, locale?: string): number {
        const other = new Datetime(dateInput, timezone, locale);
        const u = isParams(dateInput) ? dateInput.unit ?? unit : unit;
        return other.date.diff(this.date, u);
    }

    diffYear(date?: DateInput | Params, tz?: string, locale?: string): number    { return Math.ceil(this.diff(date, "year", tz, locale)); }
    diffMonth(date?: DateInput | Params, tz?: string, locale?: string): number   { return Math.ceil(this.diff(date, "month", tz, locale)); }
    diffDay(date?: DateInput | Params, tz?: string, locale?: string): number     { return Math.ceil(this.diff(date, "day", tz, locale)); }
    diffHour(date?: DateInput | Params, tz?: string, locale?: string): number    { return Math.ceil(this.diff(date, "hour", tz, locale)); }
    diffMinutes(date?: DateInput | Params, tz?: string, locale?: string): number { return Math.ceil(this.diff(date, "minute", tz, locale)); }
    diffSecond(date?: DateInput | Params, tz?: string, locale?: string): number  { return Math.ceil(this.diff(date, "second", tz, locale)); }
    diffWeek(date?: DateInput | Params, tz?: string, locale?: string): number    { return Math.ceil(this.diff(date, "week", tz, locale)); }

    // ── Formatting ────────────────────────────────────────────────────────────

    /**
     * Formats the date into a specified string format.
     *
     * @param {string | Params} [format] - The format string or a Params object containing the format.
     * If not specified, a default format is used.
     * @return {string} The formatted date string.
     */
    format(format?: string | DateFormat | Params): string {
        const f = (isParams(format) ? format.format : format) ?? Datetime.DEFAULT_FORMAT;
        return setFirstName(this.date.format(f));
    }

    /**
     * Formats the current date and time according to the specified format or parameters.
     *
     * @param {string | Params} [format] - The format string or an object containing formatting parameters. If a `Params` object is provided, it can include a `format` property for defining the date-time format and a `to` property that adjusts the format with additional context.
     * @param {boolean} [to] - An optional flag to determine whether to use a specific format variant. Ignored if a `Params` object is passed as the `format` parameter.
     * @return {string} The formatted date-time string based on the provided format or default settings.
     */
    fDatetime(format?: string | DateFormat | Params, to?: boolean): string {
        const f = isParams(format) ? format.format : format;
        const defaultFormat = isParams(format)
            ? format.to ? DateFormat.DATETIME_SLASH_TO : DateFormat.DATETIME_SLASH
            : to ? DateFormat.DATETIME_SLASH_TO : DateFormat.DATETIME_SLASH
        return setFirstName(this.format(f || defaultFormat));
    }

    /**
     * Formats the current date based on the provided format string or parameters.
     *
     * @param {string | Params} [format] - A string defining the desired date format or an object of parameters. Defaults to "DD MMMM YYYY" if not provided.
     * @return {string} The formatted date string.
     */
    fDate(format?: string | DateFormat | Params): string {
        return setFirstName(this.format(format ?? DateFormat.DATE_LONG));
    }

    /**
     * Returns the current time formatted according to the provided format string or Params object.
     * If no format is provided, it defaults to "HH:mm".
     *
     * @param {string | Params} [format] - The format string or Params object to customize the output.
     * @return {string} The formatted time as a string.
     */
    time(format?: string | Params): string {
        return setFirstName(this.format(format ?? DateFormat.TIME));
    }

    /**
     * Converts the current date object into a formatted string representing
     * the full day including the day name, date, month name, and year,
     * and applies a custom transformation using `setFirstName` function.
     *
     * @return {string} A string formatted as "DayName Day MonthName Year" after processing with `setFirstName`.
     */
    fullDay(): string {
        return setFirstName(this.format(DateFormat.DATE_FULL_WEEKDAY));
    }

    // ── Comparisons ───────────────────────────────────────────────────────────

    isAfter(date?: DateInput | Params): boolean {
        return this.date.isAfter(new Datetime(date).date);
    }

    isStrictAfter(date?: DateInput | Params): boolean {
        const other = new Datetime(date).date;
        return this.date.startOf("day").isAfter(other.startOf("day"));
    }

    isBefore(date?: DateInput | Params): boolean {
        return this.date.isBefore(new Datetime(date).date);
    }

    // FIX: original called this.strictDay() which mutated this permanently.
    //      Now strictDay() returns a new Datetime, so this is untouched.
    isStrictBefore(date?: DateInput | Params): boolean {
        const other = new Datetime(date).date;
        return this.strictDay().date.isBefore(other.startOf("day"));
    }

    isBetween(start: DateInput | Params, end: DateInput | Params): boolean {
        return this.isAfter(start) && this.isBefore(end);
    }

    compare(date?: DateInput | Params): -1 | 0 | 1 {
        if (this.isBefore(date)) return -1;
        if (this.isAfter(date)) return 1;
        if (this.isSame(date)) return 0;
        throw new Error("Invalid date");
    }

    // FIX: original mutated this twice (once per timeToDatetime call), so by the
    //      time it called this.isAfter(date1), `this` was already equal to date2.
    //      Now timeToDatetime returns a new Datetime, so this remains the current time.
    isCurrentTimeBetween(startTime: number[] | Params, endTime?: number[]): boolean {
        const { start, end } = isParams(startTime)
            ? { start: startTime.startTime, end: startTime.endTime } // FIX: was statTime
            : { start: startTime, end: endTime };
        const date1 = this.timeToDatetime(start as number[]);
        const date2 = this.timeToDatetime(end as number[]);
        return this.isAfter(date1.toDayjs()) && this.isBefore(date2.toDayjs());
    }

    isSame(dateInput?: DateInput | Params, unit?: ManipulateType, tz?: string, locale?: string): boolean {
        const other = new Datetime(dateInput, tz, locale);
        const u = unit ?? (isParams(dateInput) ? dateInput.unit : undefined);
        return this.date.isSame(other.date, u);
    }

    isSameDay(dateInput?: DateInput | Params, tz?: string, locale?: string): boolean   { return this.isSame(dateInput, "day", tz, locale); }
    isSameMonth(dateInput?: DateInput | Params, tz?: string, locale?: string): boolean { return this.isSame(dateInput, "month", tz, locale); }
    isSameYear(dateInput?: DateInput | Params, tz?: string, locale?: string): boolean  { return this.isSame(dateInput, "year", tz, locale); }
    isSameWeek(dateInput?: DateInput | Params, tz?: string, locale?: string): boolean  { return this.isSame(dateInput, "week", tz, locale); }

    isSameOrBefore(dateInput?: DateInput | Params, unit?: ManipulateType, tz?: string, locale?: string): boolean {
        const other = new Datetime(dateInput, tz, locale);
        const u = unit ?? (isParams(dateInput) ? dateInput.unit : undefined);
        return this.date.isSameOrBefore(other.date, u);
    }

    isSameOrAfter(dateInput?: DateInput | Params, unit?: ManipulateType, tz?: string, locale?: string): boolean {
        const other = new Datetime(dateInput, tz, locale);
        const u = unit ?? (isParams(dateInput) ? dateInput.unit : undefined);
        return this.date.isSameOrAfter(other.date, u);
    }

    isValid(): boolean    { return this.date.isValid(); }
    isToday(): boolean    { return this.date.isToday(); }
    isYesterday(): boolean { return this.date.isYesterday(); }
    isTomorrow(): boolean { return this.date.isTomorrow(); }
}

export default Datetime;
