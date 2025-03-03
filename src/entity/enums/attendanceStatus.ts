import {Attendance} from "../domain/attendance.ts";
import {AttendanceCount, AttendanceRecord, AttendanceStatusCount} from "../../utils/interfaces.ts";

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

export const countStatus = (attendanceStatus: AttendanceCount[]): AttendanceStatusCount => {
    const counts = {
        present: 0,
        absent: 0,
        late: 0,
        excused: 0
    };

    attendanceStatus.forEach(record => {
        switch (AttendanceStatus[record.status as unknown as keyof typeof AttendanceStatus]) {
            case AttendanceStatus.ABSENT:
                counts.absent = record.count;
                break;
            case AttendanceStatus.EXCUSED:
                counts.excused = record.count;
                break;
            case AttendanceStatus.PRESENT:
                counts.present = record.count;
                break;
            case AttendanceStatus.LATE:
                counts.late = record.count;
                break;
            default:
                break;
        }
    });

    return counts;
};

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