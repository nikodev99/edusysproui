import {AcademicYear} from "./academicYear.ts";
import {School} from "./school.ts";

export interface Semester {
    semesterId: number
    template: SemesterTemplate
    startDate: Date | number[] | string
    endDate: Date | number[] | string
    academicYear: AcademicYear
}

export interface SemesterTemplate {
    id: number,
    semesterName: string,
    displayOrder: number,
    description: string,
    schoolId: string
    school: School
}