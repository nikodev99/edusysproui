import {EnumType} from "./interfaces.ts"
import countries from 'world-countries'
import dayjs from "dayjs";
import 'dayjs/locale/fr.js'
import {BloodType} from "../entity/enums/bloodType.ts";

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

const arrayToDate = (dateArray: Date | number[]): Date => {
    if (Array.isArray(dateArray)) {
        const [year, month, day] = dateArray
        return new Date(year, month - 1, day);
    }
    return new Date(dateArray)
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

export const chooseColor = (name: string): string | null | undefined => {
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
            case 'W': return '#BDB76B'; // Dark Khaki
            case 'X': return '#1E90FF'; // Dark Dodger Blue
            case 'Y': return '#483D8B'; // Dark Medium Slate Blue
            case 'Z': return '#4682B4'; // Dark Steel Blue
            default: return null;
        }
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

export const lowerName = (first?: string, last?: string) => {
    const name = `${firstWord(first)} ${firstWord(last)}`
    if (name.length >= 17) {
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

export const fontFamily = 'Mulish, Kameron, Helvetica, sans-serif'