import {Attendance} from "../domain/attendance.ts";
import {AttendanceRecord} from "../../utils/interfaces.ts";

export enum AttendanceStatus {
    PRESENT = 'Présent',
    ABSENT = 'Absent',
    LATE = 'En Retard',
    EXCUSED = 'Excusé',
}

export const attendanceTag = (status: AttendanceStatus) => {
    let tagColor
    let tagText
    switch (status) {
        case 'ABSENT' as AttendanceStatus:
            tagColor = 'danger'
            tagText = AttendanceStatus.ABSENT
            break;
        case 'EXCUSED' as AttendanceStatus:
            tagColor = 'processing'
            tagText = AttendanceStatus.EXCUSED
            break;
        case 'PRESENT' as AttendanceStatus:
            tagColor = 'success'
            tagText = AttendanceStatus.PRESENT
            break;
        case 'LATE' as AttendanceStatus:
            tagColor = 'warning'
            tagText = AttendanceStatus.LATE
            break;
        default:
            tagColor = 'gray';
    }

    return [tagColor, tagText];
}

export const countAttendanceStatuses = (dataSource: Attendance[] | AttendanceRecord[]) => {
    const counts = {
        present: 0,
        absent: 0,
        late: 0,
        excused: 0
    }

    dataSource.forEach(record => {
        switch (record.status) {
            case 'ABSENT':
                counts.absent++
                break
            case 'EXCUSED':
                counts.excused++
                break
            case 'PRESENT':
                counts.present++
                break
            case 'LATE':
                counts.late++
                break
            default:
                break
        }
    })

    return counts;
}