import {Card, Progress, Statistic} from "antd";
import {WidgetItem} from "../../../utils/interfaces.ts";

const Widget = (
    {title, value, progress, precision, valueStyle, prefix, suffix, bottomValue, hasShadow}: WidgetItem
) => {

    const progressElement = progress && progress.active ?
        <Progress
            type={progress.type ? progress.type as 'line' : 'line'}
            percent={progress.percent}
            status={progress.status ? progress.status as 'success': 'normal'}
            strokeColor={progress.color ? progress.color : undefined}
        />
        : undefined

    return (
        <Card bordered={false} className={hasShadow ? 'widget': undefined}>
            <Statistic
                title={title}
                value={value}
                precision={precision}
                valueStyle={valueStyle}
                prefix={prefix}
                suffix={suffix}
            />
            {bottomValue ?? progressElement ?? undefined}
        </Card>
    )
}

export { Widget }