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

export const attendanceTag = (status: Att) => {
    let tagColor
    let tagText
    switch (status) {
        case 'ABSENT' as Att:
            tagColor = 'error'
            tagText = Att.ABSENT
            break;
        case 'EXCUSED' as Att:
            tagColor = 'processing'
            tagText = Att.EXCUSED
            break;
        case 'PRESENT' as Att:
            tagColor = 'success'
            tagText = Att.PRESENT
            break;
        case 'LATE' as Att:
            tagColor = 'warning'
            tagText = Att.LATE
            break;
        default:
            tagColor = 'gray';
    }

    return [tagColor, tagText];
}