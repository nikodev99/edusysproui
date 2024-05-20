import {School} from "./school.ts";
import {Grade} from "./grade.ts";

export interface Planning {
    id?: number
    academicYear?: string
    designation?: string
    termStartDate?: Date
    termEndDate?: Date
    semester?: string
    school?: School
    grade?: Grade
    createdAt?: Date
    updatedAt?: Date
}