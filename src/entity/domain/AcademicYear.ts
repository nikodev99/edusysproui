import {School} from "./school.ts";

export interface AcademicYear {
    id: string
    startDate: Date | number[] | string
    endDate: Date | number[] | string
    current: boolean
    academicYear: string
    school: School
}