import {Grade} from "./grade.ts";
import {AcademicYear} from "./AcademicYear.ts";

export interface Planning {
    id?: number
    academicYear?: AcademicYear
    designation?: string
    termStartDate?: Date
    termEndDate?: Date
    semester?: string
    grade?: Grade
    createdAt?: Date
    updatedAt?: Date
}