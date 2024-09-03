import {Card, Progress, Statistic} from "antd";

interface WidgetProps {
    title: string;
    value: string | number;
    progress?: {
        active: boolean
        status?: string
        type?: string
        percent: number
        color?: string
    }
}

const Widget = ({title, value, progress}: WidgetProps) => {


    const progressElement = progress && progress.active ?
        <Progress
            type={progress.type ? progress.type as 'line' : 'line'}
            percent={progress.percent}
            status={progress.status ? progress.status as 'success': 'normal'}
            strokeColor={progress.color ? progress.color : undefined}
        />
        : undefined

    return (
        <Card bordered={false} className='widget'>
            <Statistic
                title={title}
                value={value}
            />
            {progressElement}
        </Card>
    )
}

export default Widget