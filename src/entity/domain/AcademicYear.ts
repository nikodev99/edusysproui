import {School} from "./school.ts";

export interface AcademicYear {
    id?: string
    startDate?: Date
    endDate?: Date
    current?: boolean
    academicYear?: string
    school?: School
}