import {Grade} from "./grade.ts";
import {Semester} from "./semester.ts";

export interface Planning {
    id?: number
    semester?: Semester
    designation?: string
    termStartDate?: Date | number[]
    termEndDate?: Date | number[]
    grade?: Grade
    createdAt?: Date | number
    updatedAt?: Date | number
}