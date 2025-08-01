import {School} from "./school.ts";
import {Planning} from "./planning.ts";
import {SectionType} from "../enums/section.ts";

export interface Grade {
    id?: number
    section?: SectionType | string
    subSection?: string
    school?: School
    planning?: Planning[]
    createdAt?: Date | number[] | string
    modifyAt?: Date | number[] | string
}