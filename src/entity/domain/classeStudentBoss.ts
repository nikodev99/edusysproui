import {AcademicYear} from "./academicYear.ts";
import {Student} from "./student.ts";

export interface ClasseStudentBoss {
    id?: number
    academicYear?: AcademicYear
    principalStudent?: Student
    current?: boolean
    startPeriod?: Date | number[]
    endPeriod?:  | number[]
}