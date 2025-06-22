import {Attendance} from "../domain/attendance.ts";
import {AttendanceCount, AttendanceRecord} from "../../core/utils/interfaces.ts";

export enum AttendanceStatus {
    PRESENT = 'Présent',
    ABSENT = 'Absent',
    LATE = 'Retardataire',
    EXCUSED = 'Excusé',
}

export enum AttendanceStatusLiteral {
    PRESENT,
    ABSENT,
    LATE,
    EXCUSED
}

export const compareAttendanceStatus = (status: AttendanceStatus, literal: AttendanceStatusLiteral) => {
    const literalKey = statusToLiteral(status)

    console.log('STATUS: ', {literal, literalKey})

    return literal === literalKey
}

export const statusToLiteral = (status: AttendanceStatus): AttendanceStatusLiteral => {
    switch (status) {
        case 'PRESENT' as AttendanceStatus:
            return AttendanceStatusLiteral.PRESENT
        case 'ABSENT' as AttendanceStatus:
            return AttendanceStatusLiteral.ABSENT
        case 'LATE' as AttendanceStatus:
            return AttendanceStatusLiteral.LATE
        case 'EXCUSED' as AttendanceStatus:
            return AttendanceStatusLiteral.EXCUSED
        default:
            throw new Error(`Unknown attendance status: ${status}`)
    }
}

export const litoralToStatus = (status: AttendanceStatusLiteral): AttendanceStatus => {
    console.log('LITERAL: ', status)
    switch (status) {
        case 0 as AttendanceStatusLiteral:
            return AttendanceStatus.PRESENT
        case 1 as AttendanceStatusLiteral:
            return AttendanceStatus.ABSENT
        case 2 as AttendanceStatusLiteral:
            return AttendanceStatus.LATE
        case 3 as AttendanceStatusLiteral:
            return AttendanceStatus.EXCUSED
        default:
            throw new Error(`Unknown attendance literal status: ${status}`)
    }
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

export const getColors = (attendanceStatus: AttendanceStatus) => {
    switch (attendanceStatus) {
        case AttendanceStatus.ABSENT:
            return '#dc3545'
        case AttendanceStatus.EXCUSED:
            return '#17a2b8'
        case AttendanceStatus.PRESENT:
            return '#28a745'
        case AttendanceStatus.LATE:
            return '#ffc107'
        default:
            return '#ccc'
    }
}

export const countAll = (status: AttendanceCount[]) => {
    return status?.reduce((sum, record) => sum + record.count, 0) || 0;
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