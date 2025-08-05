import {AcademicYear} from "./academicYear.ts";

export interface Semester {
    semesterId: number
    template: {
        id: number
        semesterName: string
        displayOrder: number
        description: string
    }
    startDate: Date | number[] | string
    endDate: Date | number[] | string
    academicYear: AcademicYear
}