import {AcademicYear} from "./academicYear.ts";

export interface Semester {
    semesterId: number
    semesterName: string
    academicYear: AcademicYear
    description: string
}