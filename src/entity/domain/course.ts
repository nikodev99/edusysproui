import {School} from "./school.ts";
import {Department} from "./department.ts";

export interface Course {
    id?: number
    course?: string
    abbr?: string
    department?: Department
    school?: School
    createdAt?: Date
    modifyAt?: Date
}