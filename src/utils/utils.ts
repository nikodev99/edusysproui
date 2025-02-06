import {ApiEvent, Color, DateExplose, EnumType, GenderCounted} from "./interfaces.ts"
import countries from 'world-countries'
import dayjs, {OpUnitType} from "dayjs";
import 'dayjs/locale/fr.js'
import {BloodType} from "../entity/enums/bloodType.ts";
import {ProgressProps} from "antd";
import {Day} from "../entity/enums/day.ts";
import {Gender} from "../entity/enums/gender.tsx";
import {Schedule} from "../entity";

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

export const enumToObjectArray = (enumObj: EnumType) => {
    return Object.keys(enumObj)
        .filter(key => isNaN(Number(key)))
        .map(key => ({
            value: enumObj[key as keyof EnumType],
            label: key
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

export const calculateAverageAge = (students?: GenderCounted[] | null): number => {
    const totalStudents = students?.reduce((sum, group) => sum + group.count, 0)
    const totalAge = students?.reduce((sum, group) => sum + group.count * group.ageAverage, 0)
    return totalStudents && totalAge && totalStudents > 0 ? totalAge / totalStudents : 0
}

export const getAge = (dateArray?: number[]): number => {
    const date = new Date()
    const incomingYear = dateArray ? arrayToDate(dateArray).getFullYear() : 0
    return date.getFullYear() - incomingYear
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
    return index && total ? showSign ? `${percent} '%'` : percent : undefined
}

export const arrayToDate = (dateArray: Date | number[], time?: number[]): Date => {
    if (Array.isArray(dateArray)) {
        const [year, month, day] = dateArray
        let date = new Date(year, month - 1, day)
        if (time) {
            const [hour, minute] = time && time?.length > 0 ? time : [0, 0]
            date = new Date(year, month - 1, day, hour, minute, 0)
        }
        return new Date(date);
    }
    return new Date(dateArray)
}

export const getMinMaxTimes = (data: Schedule[]) => {
    let minStartTime: [number, number] = [24, 0]
    let maxEndTime: [number, number] = [0, 0]

    for (const entry of data) {
        const start: [number, number] = entry.startTime as [number, number]
        const end: [number, number] = entry.endTime as [number, number]
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
    let defaultFormat: string = to ? 'DD/MM/YYYY à HH:mm' : 'DD/MM/YYYY HH:mm'
    if (timestamp) {
        if (format) {
            defaultFormat = format
        }
        return dayjs.unix(timestamp as number).format(defaultFormat)
    }
    return undefined
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

export const showDates = (startDate: Date | number[], endDate: Date | number[], format?: string) => {
    const start = setDayJsDate(startDate)
    const end = setDayJsDate(endDate)
    let formatted = `${start?.format(format ?? 'DD/MM/YYYY')} - ${end?.format(format ?? 'DD/MM/YYYY')}`
    if (start?.year() === end?.year()) {
        formatted = `${start?.format(format ?? 'DD/MM')} - ${end?.format(format ?? 'DD/MM/YYYY')}`
    }
    return formatted
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

export const getDayFromDate = (): Day => {
    const date = new Date();
    const dateIndex = date.getDay();
    return (dateIndex + 6) % 7
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

export const dateBefore = (date: Date, unit?: OpUnitType) => {
    const today = dayjs()
    const dateToCompareWith = dayjs(date)
    return dateToCompareWith.isBefore(today, unit)
}

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

export function getDiffBetweenDates(date1: string | number[] | Date, date2: string | number[] | Date, unit?: "minute" | "hour" | "day" | "month" | "year" ): number | null {
    const day1 = setDayJsDate(date1)
    const day2 = setDayJsDate(date2)

    if (day1 && day2) return day2?.diff(day1, unit)
    return null
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

export const setTime = (time: number[]) => {
    const [hour, minute] = time;
    return dayjs().hour(hour).minute(minute).format('HH:mm');
}

export const timeConcat = (startTime: number[], endTime: number[]) => {
    return `${setTime(startTime)} - ${setTime(endTime)}`;
}

export const isCurrentTimeBetween = (startTime: number[], endTime: number[]): boolean => {
    const now = dayjs();
    const start = dayjs().hour(startTime[0]).minute(startTime[1]);
    const end = dayjs().hour(endTime[0]).minute(endTime[1]);
    return now.isAfter(start) && now.isBefore(end);
};

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
                default: return undefined;
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
            default: return undefined;
        }
    }
}

export const createConicGradient = (colors: string[], hasStep?: boolean): string[] | ProgressProps['strokeColor'] => {
    if(hasStep) {
        const step = 100 / (colors.length - 1)
        return colors.reduce((gradient: Record<string, string>, color, index) => {
            const percentage = `${Math.round(step * index)}%`
            gradient[percentage] = color
            console.log('returned: ', gradient)
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

export const setFirstName = (firstName?: string) => {
    if (firstName)
        return firstName.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
    return ''
}

export const setName = (lastName?: string, firstName?: string, maidenName?: string, showMaiden?: boolean) => {
    const fullRealName = setFirstName(`${lastName} ${firstName}`)
    if (lastName && firstName) {
        if (maidenName) {
            return showMaiden ? setFirstName(`${lastName} née ${maidenName} ${firstName}`) : fullRealName
        }else {
            return fullRealName
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

export const cutStatement = (statement: string, maxLength: number) => {
    if (statement) {
        if (statement?.length <= maxLength) {
            return statement
        }
        const truncate = statement.slice(0, maxLength)
        const lastSpaceIndex = truncate.lastIndexOf(' ')
        return statement?.slice(0, lastSpaceIndex)
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

export const lowerName = (first: string, last?: string, length?: number) => {
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

export const transformEvents = (apiEvents: ApiEvent[]) => {
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

    const getDayDate = (dayOfWeek: Day, [hour, minute]: [number, number], now: Date): (Date | null)[] => {
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
                console.log("Get Day: ", date.getDay())
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
        }));
    });
};


export const COLOR: Color[] = ['#0088FE', '#FF6F61', '#00C49F', '#6B8E23','#FFBB28','#FFD700', '#FF8042', '#20B2AA', '#FF6347', '#4682B4','#8A2BE2', '#D2691E', '#32CD32'];
export const fontFamily = 'Mulish, Kameron, Helvetica, sans-serif'