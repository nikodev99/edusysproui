import {ApiEvent, Color, DateExplose, EnumType, ExamView, ID, StudentListDataType} from "./interfaces.ts"
import countries from 'world-countries'
import dayjs from "dayjs";
import 'dayjs/locale/fr.js'
import {BloodType} from "../../entity/enums/bloodType.ts";
import {ProgressProps} from "antd";
import {Day} from "../../entity/enums/day.ts";
import {Gender} from "../../entity/enums/gender.tsx";
import {Assignment, Enrollment, Individual, Schedule} from "../../entity";

export const createElement = (htmlElement: string, parentNode: Element|null, attributes?: {[key: string]: string}, content?: string) => {

    const element = document.createElement(htmlElement);

    if (parentNode === null) {
        console.error('parentNode not found')
        return
    }

    if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        })
    }

    if (content) {
        element.textContent = content;
    }

    parentNode?.appendChild(element)
}

export const isString = (value: unknown): value is string => typeof value === 'string'

export const isObjectEmpty = (value: object): boolean => {
    return Object.keys(value).length === 0
}

export const connectToElement = (connector: string, attributes?: {[key: string]: string}) => {
    const element = document.querySelector(connector);
    if (element) {
        if (attributes) {
            Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            })
        }
    }
}

export const enumToObjectArray = (enumObj: EnumType, inverse?: boolean, enumObj2?: EnumType) => {
    return Object.keys(enumObj)
        .filter(key => isNaN(Number(key)))
        .map(key => ({
            value: inverse ?
                enumObj2 && key in enumObj2 ?
                    enumObj2[key] :
                    key :
                enumObj[key as keyof EnumType],
            label: inverse ?
                enumObj[key as keyof EnumType] :
                key
        }))
}

export const enumToObjectArrayForFiltering = (enumObj: EnumType) => {
    return Object.keys(enumObj)
        .filter(key => isNaN(Number(key)))
        .map(key => ({
            value: enumObj[key as keyof EnumType],
            text: key
        }))
}

/**
 * Compute a deep diff between original and updated.
 * @param original The original value of type TObject.
 * @param updated The updated value of type TObject.
 * @returns An object containing:
 *   - changes: of type TObject or undefined if no change. For primitives/arrays/type-changes, returns updated. For nested objects, returns a partial object with only changed fields.
 *   - deletedKeys: string[] for keys removed at the top level if TObject is a plain object.
 */
export const diffObject = <TObject>(original: TObject, updated: TObject) => {
    if (deepEquals(original, updated)) {
        return {changes: undefined, deletedKeys: []}
    }

    const originalIsObj = original !== null && typeof original === 'object'
    const updateIsObj = updated !== null && typeof updated === 'object'

    if (!originalIsObj || !updateIsObj) {
        return {changes: updated, deletedKeys: []}
    }

    if (Array.isArray(original) && Array.isArray(updated)) {
        return { changes: updated, deletedKeys: [] };
    }
    if (Array.isArray(original) || Array.isArray(updated)) {
        return { changes: updated, deletedKeys: [] };
    }

    const changes: Record<string, unknown> = {};
    const deletedKeys: string[] = [];

    const origObj = original as Record<string, unknown>;
    const updObj = updated as Record<string, unknown>;
    
    for (const key of Object.keys(updObj)) {
        if (!Object.prototype.hasOwnProperty.call(origObj, key)) {
            changes[key] = updObj[key];
        } else {
            const { changes: subChanges } = diffObject(origObj[key] as TObject, updObj[key] as TObject);
            if (subChanges !== undefined) {
                changes[key] = subChanges;
            }
        }
    }
    
    for (const key of Object.keys(origObj)) {
        if (!Object.prototype.hasOwnProperty.call(updObj, key)) {
            deletedKeys.push(key);
        }
    }

    const hasChanges = Object.keys(changes).length > 0;
    return { changes: hasChanges ? (changes as TObject) : undefined, deletedKeys };
}

export const deepEquals = (a: unknown, b: unknown) => {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (a && b && typeof a === 'object') {
        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false
            for (let i = 0; i < a.length; i++) {
                if (!deepEquals(a[i], b[i])) return false
            }
            return true
        }
        if (Array.isArray(a) || Array.isArray(b)) return false
        const aKeys = Object.keys(a)
        const bKeys = Object.keys(b)
        if (aKeys.length !== bKeys.length) return false
        for (const key of aKeys) {
            // eslint-disable-next-line no-prototype-builtins
            if (!b?.hasOwnProperty(key)) return false
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (!deepEquals(a[key], b[key])) return false
        }
        return true
    }
    return false
}

export const getCountryListInFrench = () => {
    return countries.map(country => ({
        value: country.cca3,
        label: country.translations.fra.common
    }))
}

export const getCountry = (cca3: string) => {
    return countries.find(country => country.cca3 === cca3)
}

export const getStringAcademicYear = (startDate?: Date | [number, number, number], endDate?: Date | [number, number, number]) => {
    if (startDate && endDate) {
        return `${arrayToDate(startDate).getFullYear()} - ${arrayToDate(endDate).getFullYear()}`
    }
    return undefined
}

export const sumInArray = <T extends object | number>(arrayToSum: T[], arrayKey?: keyof T): number => {
    return arrayToSum?.reduce((sum, item) => {
        if (arrayKey && typeof item === 'object' && item !== null) {
            const value = item[arrayKey] as unknown;
            return sum + (typeof value === 'number' ? value : 0);
        }
        return sum + (typeof item === 'number' ? item : 0);
    }, 0);
};

export const getAge = (dateArray?: number[], hasLabel: boolean = false): number | string => {
    const date = new Date()
    const incomingYear = dateArray ? arrayToDate(dateArray).getFullYear() : 0
    const age = date.getFullYear() - incomingYear
    return hasLabel ? `${age} ans` : age
}

export const currency = (input?: number) => {
    return numberFormat(input, {locale: 'fr-CG', style: "currency", currency: 'XAF'})
}

export const numberFormat = (input?: number, options?: {
    locale: string | string[],
    style?: string | 'decimal' | 'currency' | 'percent' | 'unit',
    currency?: string
}) => {
    return input ?
        Intl.NumberFormat(options?.locale ?? 'fr-CG', {
            style: options?.style ?? 'currency',
            currency: options?.style ?? 'XAF'
        }).format(input) :
        Intl.NumberFormat(options?.locale ?? 'fr-CG', {
            style: options?.style ?? 'currency',
            currency: options?.style ?? 'XAF'
        }).format(0)
}

export const findPercent = (index: number, total: number, showSign?: boolean): number | string | undefined => {
    const percent: number = Math.round((index * 100) / total)
    return index >= 0 && total ? showSign ? `${percent} %` : percent : undefined
}

/**
 * Converts an array representing a date (optionally with time) into a JavaScript Date object.
 *
 * @param {Date | number[]} dateArray - A Date object or an array `[year, month, day]`.
 * @param {number[]} [time] - An optional array `[hour, minute]`, defaults to `[0, 0]` if not provided.
 * @returns {Date} A JavaScript Date object representing the specified date and time.
 */
export const arrayToDate = (dateArray: Date | number[], time?: number[]): Date => {
    if (Array.isArray(dateArray)) {
        const [year, month, day] = dateArray;
        const [hour, minute] = time?.length ? time : [0, 0];
        return new Date(year, month - 1, day, hour, minute, 0);
    }
    return new Date(dateArray);
}

export const getMinMaxTimes = (data: Schedule[]) => {
    let minStartTime: [number, number] = [24, 0]
    let maxEndTime: [number, number] = [0, 0]

    for (const entry of data) {
        const start: [number, number] = parseTimeString(entry.startTime as number[])
        const end: [number, number] = parseTimeString(entry.endTime as [number, number])

        const startDate = start ? new Date(0, 0, 0, start[0], start[1] as number, 0) : new Date
        const endDate = end ? new Date(0, 0, 0, end[0], end[1], 0) : new Date()

        if (startDate < new Date(0, 0, 0, minStartTime[0], minStartTime[1], 0)) {
            minStartTime = start
        }

        if (endDate > new Date(0, 0, 0, maxEndTime[0], maxEndTime[1], 0)) {
            maxEndTime = end
        }
    }
    return {minStartTime, maxEndTime}
}

export const getDistinctArray = <T>(arr: T[], keySelector: (item: T) => unknown): T[] => {
    const seen = new Set<unknown>()
    return arr.filter(item => {
        const key = keySelector ? keySelector(item) : item
        if (seen.has(key)) {
            return false
        }
        seen.add(key)
        return true
    })
}

export const fDatetime = (timestamp: Date | number | string, to?: boolean, format?: string) => {
    if (!timestamp) return undefined;
    const defaultFormat: string = format || (to ? 'DD/MM/YYYY à HH:mm' : 'DD/MM/YYYY HH:mm');
    return dayjs(timestamp).format(defaultFormat);
}

export const datetimeExpose = (timestamp?: number): DateExplose | undefined => {
    if (timestamp) {
        const date = dayjs.unix(timestamp)
        return {
            day: date.date(),
            month: date.month() + 1,
            year: date.year(),
            hour: date.hour(),
            minute: date.minute(),
            second: date.second(),
        } as DateExplose
    }
    return undefined
}

export const fDate = (date?: Date | number[] | string, format?: string) => {
    if (!format) {
        format = 'DD MMMM YYYY';
    }
    return setFirstName(formattedDate(date, format));
}

export const fullDay = (date?: Date | number[] | string) => {
    const format: string = 'dddd D MMMM YYYY';
    return formattedDate(date, format);
}

export const today = (format?: string): string => {
    return fDate(new Date(), format) as string;
}

export const ISOToday = (): string => {
    return today('DD/MM/YYYY');
}

export const monthsBetween = (startDate?: Date | number[] | string, endDate?: Date | number[] | string) => {
    const end = setDayJsDate(endDate)
    const start = setDayJsDate(startDate)
    const monthNum = end?.diff(start, 'month')
    return monthNum && monthNum < 9 ? 9 : monthNum;
}

export const dateCompare = (date: Date) => {
    const today = dayjs()
    const dateToCompareWith = dayjs(date)
    return dateToCompareWith.isAfter(today)
}

export const parseTimeString = (timeString: number[] | string): [number, number] => {
    if (!timeString || typeof timeString !== 'string') {
        console.error('Invalid time string:', timeString);
        return [0, 0]; // fallback to midnight
    }

    if (Array.isArray(timeString)) {
        return timeString as unknown as [number, number];
    }

    const [hours, minutes] = timeString.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
        console.error('Unable to parse time string:', timeString);
        return [0, 0];
    }
    return [hours, minutes];
};

export const setDayJsDate = (date?: Date | number[] | string) => {
    if (date) {
        let dayjsDate
        if (Array.isArray(date)) {
            const [year, month, day] = date;
            dayjsDate = dayjs(new Date(year, month - 1, day));
        } else if (typeof date === 'string') {
            dayjsDate = dayjs(date);
        } else {
            dayjsDate = dayjs(date);
        }
        return dayjsDate
    }
    return undefined
}

export function getDiffFromNow(date:[number, number, number], unit?: "minute" | "hour" | "day" | "month" | "year", time?: [number, number]): number | null {
    const day1 = setDayJsDate(new Date())
    if (date) {
        let dateTime = new Date(date[0], date[1] - 1, date[2]);
        if (time) {
            dateTime = new Date(date[0], date[1] - 1, date[2], time[0], time[1], 0);
        }
        const day2 = setDayJsDate(dateTime)

        if (day1 && day2) return day2?.diff(day1, unit)
    }
    return null
}

const formattedDate = (date?: Date | number[] | string, format?: string): string | undefined => {
    return setDayJsDate(date)?.locale('fr').format(format);
}

export const setTime = (time: number[] | string) => {
    const [hour, minute] = parseTimeString(time)
    return dayjs().hour(hour).minute(minute).format('HH:mm');
}

export const timeToCurrentDatetime = (time: Date | number[] | string) => {
    const today = new Date()
    if (Array.isArray(time))
        return new Date(today.getFullYear(), today.getMonth(), today.getDate(), time[0], time[1])
    if (typeof time === 'string')
        return dayjs(time).format('YYYY-MM-DDTHH:mm')
    return new Date(time)
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const assignKeys = (baseItems: any[], additionalItems: any[]) => {
    const baseWithKeys = baseItems.map((item, index) => ({
        ...item,
        key: index + 1
    }))
    const additionalWithKeys = additionalItems.length > 0 ? additionalItems.map((item, index) => ({
        ...item,
        key: baseItems.length + index + 1
    })) : []
    return [...baseWithKeys, ...additionalWithKeys]
}

export const sumObjectValues = <TData extends object>(obj?: TData): number => {
    return obj ? Object.values(obj).reduce((acc, val) => acc + val, 0) : 0
}

export const chooseColor = (name: string): string | undefined  => {
    if (name) {
        const firstChar = name.charAt(0).toUpperCase()
        if (/[0-9]/.test(firstChar)) {
            switch (firstChar) {
                case '0': return '#6e5d01'; // Gold
                case '1': return '#DC143C'; // Crimson
                case '2': return '#036241'; // Medium Spring Green
                case '3': return '#FF4500'; // Orange Red
                case '4': return '#DAA520'; // Goldenrod
                case '5': return '#3b7502'; // Chartreuse
                case '6': return '#41619a'; // Cornflower Blue
                case '7': return '#7a0a47'; // Deep Pink
                case '8': return '#188680'; // Light Sea Green
                case '9': return '#B22222'; // Firebrick
                default: return '#000C40';
            }
        }
        switch (name.toUpperCase().charAt(0)) {
            case 'A': return '#8B0000'; // Dark Red
            case 'B': return '#00008B'; // Dark Blue
            case 'C': return '#006400'; // Dark Green
            case 'D': return '#4B0082'; // Dark Purple
            case 'E': return '#008080'; // Dark Teal
            case 'F': return '#8B4500'; // Dark Orange
            case 'G': return '#4B0082'; // Dark Indigo
            case 'H': return '#800000'; // Dark Maroon
            case 'I': return '#008B8B'; // Dark Cyan
            case 'J': return '#2F4F4F'; // Dark Slate Gray
            case 'K': return '#556B2F'; // Dark Olive
            case 'L': return '#8B008B'; // Dark Magenta
            case 'M': return '#483D8B'; // Dark Slate Blue
            case 'N': return '#228B22'; // Dark Forest Green
            case 'O': return '#B8860B'; // Dark Goldenrod
            case 'P': return '#9932CC'; // Dark Orchid
            case 'Q': return '#8B4513'; // Dark Sienna
            case 'R': return '#00CED1'; // Dark Turquoise
            case 'S': return '#9400D3'; // Dark Violet
            case 'T': return '#D2691E'; // Dark Chocolate
            case 'U': return '#FF7F50'; // Dark Coral
            case 'V': return '#E9967A'; // Dark Salmon
            case 'W': return '#8d8950'; // Dark Khaki
            case 'X': return '#1E90FF'; // Dark Dodger Blue
            case 'Y': return '#483D8B'; // Dark Medium Slate Blue
            case 'Z': return '#4682B4'; // Dark Steel Blue
            default: return '#000C40';
        }
    }
}

export const createConicGradient = (colors: string[], hasStep?: boolean): string[] | ProgressProps['strokeColor'] => {
    if(hasStep) {
        const step = 100 / (colors.length - 1)
        return colors.reduce((gradient: Record<string, string>, color, index) => {
            const percentage = `${Math.round(step * index)}%`
            gradient[percentage] = color
            return gradient
        }, {})
    }
    return colors;
}

export const bloodLabel = (blood: BloodType) => {
    switch (blood) {
        case BloodType.A: return 'A+'
        case BloodType.A_: return 'A-'
        case BloodType.B: return 'B+'
        case BloodType.B_: return 'B-'
        case BloodType.AB: return 'AB+'
        case BloodType.AB_: return 'AB-'
        case BloodType.O: return 'O+'
        case BloodType.O_: return 'O-'
    }
}

export const setGender = (gender: string) => {
    return Gender[gender as unknown as keyof typeof Gender]
}

export const setFirstName = (firstName?: string): string => {
    if (firstName)
        return firstName.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
    return ''
}

export const toLower = (sequence?: string): string | null => {
    if (sequence) {
        return sequence.toLowerCase()
    }
    return null
}

export const setName = (personalInfo?: Individual, showMaiden: boolean = true): string => {
    if (!personalInfo)
        return ''

    const fullRealName = setFirstName(`${personalInfo?.lastName} ${personalInfo?.firstName}`)
    if (personalInfo?.lastName && personalInfo?.firstName) {
        if (personalInfo?.maidenName) {
            return showMaiden ?
                setFirstName(`${personalInfo?.lastName} née ${personalInfo?.maidenName} ${personalInfo?.firstName}`) :
                fullRealName as string
        }else {
            return fullRealName as string
        }
    }

    return ''
}

export const setLastName = (lastName?: string, maidenName?: string, upper ?: boolean) => {
    if (lastName) {
        if (maidenName) {
            const fullName = `${lastName} née ${maidenName}`;
            return upper ? fullName.toUpperCase() : fullName
        }else {
            return upper ? lastName.toUpperCase() : lastName
        }
    }
    return ''
}

export const cutStatement = (statement: string, maxLength: number, orElse?: string) => {
    if (statement) {
        if (statement?.length <= maxLength) {
            return statement
        }else {
            if (orElse) {
                return orElse
            }
        }
        const truncate = statement.slice(0, maxLength)
        const lastSpaceIndex = truncate.lastIndexOf(' ')
        return statement?.slice(0, lastSpaceIndex) + '... '
    }
    return undefined
}

export const joinWord = (word: string, joinCharacter?: string) => {
    return word.toLowerCase().split(' ').join(joinCharacter)
}

export const startsWithVowel = (word?: string): boolean => {
    const vowels = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'];
    return word ? vowels.includes(word.charAt(0)) : false;
}

export const firstLetter = (word?: string): string => {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export const firstWord = (word?: string): string => {
    return setFirstName(word).split(' ')[0]
}

export const cLowerName = (first: string, last?: string, length?: number) => {
    const name = `${firstWord(first)} ${firstWord(last)}`
    const nameLength = length ? length : 17
    const setInitial = (names: string[]): string => {
        return names.map((name: string) => name?.charAt(0).toUpperCase() + '.').join(' ')
    }
    let result: string = name
    if (name.length >= nameLength) {
        const firstParts = firstWord(first).split(' ')
        const lastParts = last ? firstWord(last).split(' ') : []
        const [fullFirst, ...remainingFirstArray] = firstParts
        const [fullLast, ...remainingLastArray] = lastParts
        let fullFName = firstParts.length > 1 ? `${fullFirst} ${setInitial(remainingFirstArray)}` : fullFirst
        let fullLName = lastParts.length > 0 ? lastParts.length > 1 ? `${fullLast} ${setInitial(remainingLastArray)}` : fullLast : ''

        result = `${fullFName} ${fullLName}`
        if (result?.length >= nameLength) {
            fullFName = fullFirst
            fullLName = fullLast ? fullLast : ''
            result = `${fullFName} ${fullLName}`

            if (result?.length >= nameLength) {
                fullFName = setInitial([fullFirst])
                result = `${fullFName} ${fullLName}`
            }
        }
    }
    return result
}

export const lowerName = (first?: string, last?: string, length?: number) => {
    const name = `${firstWord(first)} ${firstWord(last)}`
    const nameLength = length ? length : 17
    if (name.length >= nameLength) {
        first = first?.charAt(0).toUpperCase() + '.'
    }
    return `${firstWord(first)} ${firstWord(last)}`
}

/**
 * Retourne une chaîne de longueur exactement 6, avec des zéros devant.
 *
 * @param value - Nombre ou chaîne à formater.
 * @param singleZero - Si vrai, n'ajoute qu'un seul "0" devant la valeur.
 *                      Par défaut : false (complète jusqu'à 6 caractères).
 * @returns Chaîne formatée de longueur 6, ou préfixée d'un seul zéro.
 */
export function zeroFormat(
    value: number | string,
    singleZero: boolean = false
): string {
    const str = String(value);
    if (singleZero) {
        return str.length < 6 ? `0${str}` : str;
    }
    return str.padStart(6, "0");
}

export const convertToM = (cm?: number) => {
    const meters = cm ? cm / 100 : 0;
    return `${meters}`;
}

export const isNull = (word: string | undefined) => {
    return word === null || word === undefined || word === '' || word.length === 0;
}

export const hasField = <T extends object>(obj: T, field: keyof T): boolean => {
    return Object.keys(obj).includes(field as string)
}

export const getShortSortOrder = (order: string | undefined): 'asc' | 'desc' | undefined => {
    switch (order) {
        case 'ascend':
            return 'asc';
        case 'descend':
            return 'desc';
        default:
            return undefined;
    }
};

export const setSortFieldName = (sortField: string | string[])=>  {
    return Array.isArray(sortField)
        ? sortField[sortField.length - 1]
        : sortField
}

export const transformEvents = <T extends object>(apiEvents: ApiEvent<T>[]) => {
    const getWeekRange = (date: Date) => {
        const day = date.getDay()
        const diffToMonday = date.getDate() - day + (day === 0 ? -6 : 1)
        const monday = new Date(date.setDate(diffToMonday))
        const friday = new Date(monday)
        const saturday = new Date(monday)
        friday.setDate(monday.getDate() + 4)
        saturday.setDate(monday.getDate() + 5)
        return {monday, friday, saturday}
    }

    const getDayDate = (dayOfWeek: Day, timeInput: [number, number] | string, now: Date): (Date | null)[] => {
        let hour: number = 0, minute: number = 0;
        if (typeof timeInput === 'string') {
            [hour, minute] = timeInput.split(':').map(Number)
        }else {
            [hour, minute] = timeInput
        }

        const day = Day[dayOfWeek as unknown as keyof typeof Day];
        if (day === Day.ALL_DAYS) {
            const {monday, friday} = getWeekRange(now)
            const currentDay = new Date(monday)
            const dates: Date[] = []
            while (currentDay <= friday) {
                const date = new Date(currentDay)
                date.setHours(hour, minute, 0, 0)
                dates.push(date)
                currentDay.setDate(currentDay.getDate() + 1)
            }
            return dates
        }else {
            const {monday} = getWeekRange(now)
            return Array.from({length: 6}).map((_, index) => {
                const date = new Date(monday)
                date.setDate(monday.getDate() + index)
                if(date.getDay() === day + 1) {
                    date.setHours(hour, minute, 0, 0)
                    return date
                }
                return null
            }).filter(date => date !== null)
        }
    };

    const now = new Date()
    return apiEvents?.flatMap(event => {
        const startDates = getDayDate(event.dayOfWeek, event.startTime, now);
        const endDates = getDayDate(event.dayOfWeek, event.endTime, now);

        while(endDates.length < startDates.length) {
            endDates.push(endDates[endDates.length - 1]);
        }

        return startDates.map((start, index) => ({
            title: event.event,
            start,
            end: endDates[index] || start, // Ensure `end` aligns with `start`
            allDay: false,
            resource: { ...(event.resource || {}), start }
        }));
    });
};


export const COLOR: Color[] = ['#0088FE', '#FF6F61', '#00C49F', '#6B8E23','#FFBB28','#FFD700', '#FF8042', '#20B2AA', '#FF6347', '#4682B4','#8A2BE2', '#D2691E', '#32CD32'];
export const ATTENDANCE_STATUS_COLORS: Color[] = ['#28a745', '#dc3545', '#ffc107', '#17a2b8']
export const MAIN_COLOR = '#000C40'
export const fontFamily = 'Mulish, Kameron, Helvetica, sans-serif'

export const  setGraphColor = (color: Color | Color[], index: number): string => {
    if (Array.isArray(color)) {
        const arr =  [...color, ...COLOR]
        return arr[index % arr.length]
    }
    if (color && index < 1) {
        return color
    }
    return COLOR[index]
}

export function getAssignmentBarData(assignments: Assignment[] | null): { matiere: string; valeur: number; }[] {
    const subjectCount: { [key: string]: number } | null = assignments && assignments?.reduce((acc: Record<string, number>, exam) => {
        const subject = exam?.subject?.abbr; // Get the subject abbreviation
        if (acc[subject as string]) {
            acc[subject as string] += 1; // Increment the count for the subject
        } else {
            acc[subject as string] = 1; // Initialize count for the subject
        }
        return acc;
    }, {});

    // Convert the object to the desired format
    return subjectCount ? Object.keys(subjectCount!)?.map(key => ({
        matiere: key,
        valeur: subjectCount ? subjectCount[key] : 0,
    })) : [];
}

export const calculateSubjectsAverage = (assignments: Assignment[]) => {
    const subjectMarks: {[subject: string]: {totalMarks: number, totalCoefficient: number}} = {}
    assignments?.forEach(assignment => {
        const subjectName = assignment?.subject?.course || assignment?.examName || `Devoir ${assignment?.id}`
        const mark = assignment && assignment.marks?.length && assignment?.marks[0]?.obtainedMark || 0
        const coefficient = assignment?.coefficient || 1

        if (!subjectMarks[subjectName as string]) {
            subjectMarks[subjectName as string] = {totalMarks: 0, totalCoefficient: 0}
        }

        subjectMarks[subjectName as string].totalMarks += mark * coefficient
        subjectMarks[subjectName as string].totalCoefficient += coefficient
    })

    const averages: {[subject: string]: number } = {}
    if (subjectMarks && Object.keys(subjectMarks).length)
        for (const subject in subjectMarks) {
            averages[subject] = subjectMarks[subject].totalMarks / subjectMarks[subject].totalCoefficient
        }

    return averages
}

export const calculeMarkAverage = (averages: {[subject: string]: number } = {}): number => {
    return Object.keys(averages).length
        ? Math.round((sumInArray<number>(Object.values(averages)) / Object.keys(averages).length) * 100) / 100
        : 0
}

export const calculateGlobalAverage = (assignments: Assignment[]): number => {
    let totalMarks = 0;
    let totalCoefficient = 0;

    assignments?.forEach(assignment => {
        const mark = assignment && assignment.marks?.length && assignment?.marks[0]?.obtainedMark || 0;
        const coefficient = assignment?.coefficient || 1;

        totalMarks += mark * coefficient;
        totalCoefficient += coefficient;
    });

    return totalCoefficient > 0 ? totalMarks / totalCoefficient : 0;
};

export const calculateTotalMarks = (assignments: Assignment[]): number => {
    return assignments.reduce((total, assignment) => {
        const marks = assignment?.marks?.map(m => m.obtainedMark || 0) || [];
        return total + marks.reduce((sum, mark) => sum + mark, 0);
    }, 0)
}

export const getGoodAverageMedian = (examView: ExamView[] | null): {average: number, median: number} => {
    const result: {average: number, median: number} = {average: 0, median: 0}
    const averages: number[] = []
    if (examView) {
        examView?.forEach(exam => {
            averages?.push(exam?.totalAverage)
        })
        const sortedNumbers = averages?.sort((a, b) => a - b)
        const mid = Math.floor(sortedNumbers?.length / 2)
        result.average = averages?.filter(a => a >= 10)?.length
        result.median = sortedNumbers?.length % 2 !== 0
            ? sortedNumbers[mid]
            : (sortedNumbers[mid - 1] + sortedNumbers[mid]) / 2
    }
    return result
}

export const getUniqueness = <T, K>(
    objects: T[],
    keyExtractor: (obj: T) => K,
    uniqueIdentifier: (item: K) => ID
): K[] => {
    return Array.from(
        objects.reduce((map, obj) => {
            const keyObj = keyExtractor(obj);
            const key = uniqueIdentifier(keyObj);
            if (!map.has(key)) {
                map.set(key, keyObj);
            }
            return map;
        }, new Map<ID, K>()).values()
    )
}

export const setStudentList = (students: Enrollment[]) => {
    return students?.map(c => ({
        id: c.student.id,
        academicYear: c.academicYear,
        reference: c.student?.personalInfo?.reference,
        firstName: c.student?.personalInfo?.firstName,
        lastName: c.student?.personalInfo?.lastName,
        gender: c.student?.personalInfo?.gender,
        lastEnrolledDate: c.enrollmentDate,
        classe: c.classe?.name,
        age: getAge(c.student.personalInfo?.birthDate as number[]),
        grade: c.classe?.grade?.section,
        image: c.student?.personalInfo?.image,
    })) as StudentListDataType[] || []
}
