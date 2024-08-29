import {Card, Statistic} from "antd";
import {AttendanceRecord} from "../../../utils/interfaces.ts";
import {Attendance} from "../../../entity/enums/attendance.ts";

interface WidgetProps {
    title: string;
    data: AttendanceRecord[]
}

const Widget = ({title, data}: WidgetProps) => {

    /*function countAttendanceStatuses(): Record<Attendance, number> {
        return data.reduce((acc, record) => {
            const statusKey = record.status as Attendance;
            if (acc[statusKey] !== undefined) {
                acc[statusKey] += 1;
            }
            return acc;
        }, {
            [Attendance.PRESENT]: 0,
            [Attendance.ABSENT]: 0,
            [Attendance.LATE]: 0,
            [Attendance.EXCUSED]: 0,
        });
    }*/

    //console.log('Stats: ', countAttendanceStatuses());

    return (
        <Card bordered={false} className='widget'>
            <Statistic
                title={title}
                value={12}
            />
        </Card>
    )
}

export default Widget