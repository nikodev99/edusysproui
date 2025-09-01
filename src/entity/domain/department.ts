import {School} from "./school.ts";
import {AcademicYear} from "./academicYear.ts";
import {Individual} from "./individual.ts";

export interface Department {
    id?: number
    name?: string
    code?:string
    purpose?: string
    boss?: DBoss
    school?: School
    createdAt?: Date
    modifyAt?: Date
}

export interface DBoss {
    id?: number
    academicYear?: AcademicYear
    d_boss?: Individual
    current?: boolean
    startPeriod?:  | number[]
    endPeriod?: Date | number[]
}