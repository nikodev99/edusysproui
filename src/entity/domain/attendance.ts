import {AttendanceStatus} from "../enums/attendanceStatus.ts";
import {AcademicYear, Individual, Classe} from "@/entity";
import {Moment} from "@/core/utils/interfaces.ts";

export interface Attendance {
    id: number
    academicYear: AcademicYear
    individual: Individual
    classe: Classe
    attendanceDate: Date | number[] | string
    status: AttendanceStatus
    createdDate: Moment
    updatedDate: Moment
}