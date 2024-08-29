import {Student} from "./student.ts";
import {Classe} from "./classe.ts";
import {Attendance as Att} from "../enums/attendance.ts";
import {AcademicYear} from "./AcademicYear.ts";

export interface Attendance {
    id: number
    academicYear: AcademicYear
    student: Student
    classe: Classe
    attendanceDate: Date | number[] | string
    status: Att
}