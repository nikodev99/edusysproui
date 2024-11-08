import {Student} from "./student.ts";
import {Classe} from "./classe.ts";
import {AttendanceStatus} from "../enums/attendanceStatus.ts";
import {AcademicYear} from "./academicYear.ts";

export interface Attendance {
    id: number
    academicYear: AcademicYear
    student: Student
    classe: Classe
    attendanceDate: Date | number[] | string
    status: AttendanceStatus
}