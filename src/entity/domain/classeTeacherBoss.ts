import {AcademicYear} from "./academicYear.ts";
import {Teacher} from "./teacher.ts";

export interface ClasseTeacherBoss {
    id?: number
    academicYear?: AcademicYear
    principalTeacher?: Teacher
    current?: boolean
    startPeriod?: Date
    endPeriod?: Date
}

export interface DepartmentTeacherBoss {
    id?: number
    academicYear?: AcademicYear
    d_boss?: Teacher
    current?: boolean
    startPeriod?: Date
    endPeriod?: Date
}