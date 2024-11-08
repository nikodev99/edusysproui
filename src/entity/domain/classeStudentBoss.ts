import {AcademicYear} from "./academicYear.ts";
import {Student} from "./student.ts";

export interface ClasseStudentBoss {
    id?: number
    academicYear?: AcademicYear
    principalTeacher?: Student
    current?: boolean
    startPeriod?: Date
    endPeriod?: Date
}