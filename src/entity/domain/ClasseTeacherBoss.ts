import {AcademicYear} from "./AcademicYear.ts";
import {Teacher} from "./teacher.ts";

export interface ClasseTeacherBoss {
    id?: number
    academicYear?: AcademicYear
    principalTeacher?: Teacher
    current?: boolean
    startPeriod?: Date
    endPeriod?: Date
}