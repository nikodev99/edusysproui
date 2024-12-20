import {Color, EnumType} from "./interfaces.ts"
import countries from 'world-countries'
import dayjs from "dayjs";
import 'dayjs/locale/fr.js'
import {BloodType} from "../entity/enums/bloodType.ts";
import {ProgressProps} from "antd";
import {Day} from "../entity/enums/day.ts";

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

export const getCountyListInFrench = () => {
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

const arrayToDate = (dateArray: Date | number[]): Date => {
    if (Array.isArray(dateArray)) {
        const [year, month, day] = dateArray
        return new Date(year, month - 1, day);
    }
    return new Date(dateArray)
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

export const fDatetime = (timestamp: Date | number | string, to?: boolean) => {
    const format: string = to ? 'DD/MM/YYYY à HH:mm' : 'DD/MM/YYYY HH:mm'
    if (timestamp) {
        return dayjs.unix(timestamp as number).format(format)
    }
    return undefined
}

export const fDate = (date?: Date | number[] | string, format?: string) => {
    if (!format) {
        format = 'D MMMM YYYY';
    }
    return formattedDate(date, format);
}

export const fullDay = (date?: Date | number[] | string) => {
    const format: string = 'dddd D MMMM YYYY';
    return formattedDate(date, format);
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

const formattedDate = (date?: Date | number[] | string, format?: string) => {
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

export const chooseColor = (name: string): string | undefined  => {
    if (name)
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

export const lowerName = (first?: string, last?: string, length?: number) => {
    const name = `${firstWord(first)} ${firstWord(last)}`
    const nameLength = length ? length : 17
    if (name.length >= nameLength) {
        first = first?.charAt(0).toUpperCase() + '.'
    }
    return `${firstWord(first)} ${firstWord(last)}`
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

export const COLOR: Color[] = ['#0088FE', '#FF6F61', '#00C49F', '#6B8E23','#FFBB28','#FFD700', '#FF8042', '#20B2AA', '#FF6347', '#4682B4','#8A2BE2', '#D2691E', '#32CD32'];
export const fontFamily = 'Mulish, Kameron, Helvetica, sans-serif'