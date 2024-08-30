import {Card, Statistic} from "antd";
import {AttendanceRecord} from "../../../utils/interfaces.ts";

interface WidgetProps {
    title: string;
    data: AttendanceRecord[]
}

const Widget = ({title, data}: WidgetProps) => {

    console.log('Stats: ', data);
    console.log('Stats: ', data);
    console.log('Stats: ', data);

    return (
        <Card bordered={false} className='widget'>
            <Statistic
                title={title}
                value={data.length}
            />
        </Card>
    )
}

export default Widget