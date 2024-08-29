export enum Attendance {
    PRESENT = 'Présent',
    ABSENT = 'Absent',
    LATE = 'En Retard',
    EXCUSED = 'Excusé',
}

export const attendanceTag = (status: Attendance) => {
    let tagColor
    let tagText
    switch (status) {
        case 'ABSENT' as Attendance:
            tagColor = 'error'
            tagText = Attendance.ABSENT
            break;
        case 'EXCUSED' as Attendance:
            tagColor = 'processing'
            tagText = Attendance.EXCUSED
            break;
        case 'PRESENT' as Attendance:
            tagColor = 'success'
            tagText = Attendance.PRESENT
            break;
        case 'LATE' as Attendance:
            tagColor = 'warning'
            tagText = Attendance.LATE
            break;
        default:
            tagColor = 'gray';
    }

    return [tagColor, tagText];
}