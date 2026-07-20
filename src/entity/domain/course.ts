import {Department} from "@/entity";

export interface Course {
    id?: number
    course?: string
    abbr?: string
    discipline?: string
    department?: Department
    createdAt?: Date
    modifyAt?: Date
}