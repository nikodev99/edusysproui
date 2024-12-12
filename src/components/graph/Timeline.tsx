import {Timeline as AntTimeline, TimelineProps} from 'antd'

type CustomTimelineProps = TimelineProps

export const Timeline = (timelineProps: CustomTimelineProps) => {
    return (
        <AntTimeline {...timelineProps} />
    )
}