import {Grade} from "./grade.ts";
import {Semester} from "./semester.ts";

export interface Planning {
    id?: number
    semester?: Semester
    designation?: string
    termStartDate?: Date
    termEndDate?: Date
    grade?: Grade
    createdAt?: Date
    updatedAt?: Date
}