import {EnumType} from "./interfaces.ts"
import countries from 'world-countries'
import dayjs from "dayjs";

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

export const getAcademicYear = () => {
    const curentDate = new Date()
    const currentYear = curentDate.getFullYear()
    const curentMonth = curentDate.getMonth()
    console.log(curentMonth)
    if (curentMonth > 7) {
        return currentYear.toString() + '-' + (currentYear + 1).toString()
    }
    return (currentYear - 1).toString() + '-' + currentYear.toString()
}

export const fDatetime = (timestamp: Date | number | string) => {
    if (timestamp) {
        return dayjs.unix(timestamp as number).format('DD/MM/YYYY HH:mm')
    }
    return undefined
}

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

export const setFirstName = (firstName: string) => {
    if (firstName)
        return firstName.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
    return ''
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