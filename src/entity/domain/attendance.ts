import {Classe} from "./classe.ts";
import {AttendanceStatus} from "../enums/attendanceStatus.ts";
import {AcademicYear} from "./academicYear.ts";
import {Individual} from "./individual.ts";

export interface Attendance {
    id: number
    academicYear: AcademicYear
    individual: Individual
    classe: Classe
    attendanceDate: Date | number[] | string
    status: AttendanceStatus
}