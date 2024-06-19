import {Student} from "./student.ts";
import {Classe} from "./classe.ts";
import {Attendance as Att} from "../enums/attendance.ts";
import {School} from "./school.ts";

export interface Attendance {
    id?: number
    student?: Student
    classe?: Classe
    attendanceDate?: Date
    status?: Att
    school?: School
}