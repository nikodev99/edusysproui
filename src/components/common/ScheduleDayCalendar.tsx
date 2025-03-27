import {Schedule} from "../../entity";
import {getMinMaxTimes, timeToCurrentDatetime} from "../../core/utils/utils.ts";
import Section from "../ui/layout/Section.tsx";
import {BigCalendar} from "../graph/BigCalendar.tsx";
import {ReactNode} from "react";
import {Descriptions, Popover} from "antd";
import {DescriptionsItemType} from "antd/es/descriptions";

export const ScheduleDayCalendar = (
    {eventSchedule, sectionTitle, seeMore, hasTeacher}: {
        eventSchedule: Schedule[],
        sectionTitle: ReactNode
        seeMore?: () => void
        hasTeacher?: boolean
    }
) => {
    const events = eventSchedule.map((schedule: Schedule) => ({
        title: schedule?.course?.course
            ? hasTeacher
                ? <CustomPopover content={schedule} title={schedule?.designation} eventTitle={schedule?.course?.course} />
                : schedule?.course?.course
            : schedule?.designation,
        start: schedule.startTime ? timeToCurrentDatetime(schedule.startTime) : new Date(),
        end: schedule.endTime ? timeToCurrentDatetime(schedule.endTime): new Date(),
        allDay: false
    }))

    const {minStartTime, maxEndTime} = getMinMaxTimes(eventSchedule)

    return(
        <Section title={sectionTitle} more={seeMore !== undefined} seeMore={seeMore}>
            <BigCalendar
                data={events as []}
                views={['day']}
                defaultView='day'
                startDayTime={minStartTime}
                endDayTime={[maxEndTime[0], maxEndTime[1]]}
            />
        </Section>
    )
}

//TODO Ajouter un meilleur ui pour afficher le teacher dans l'emploie du temps.
const CustomPopover = (
    {content, title, eventTitle}: {
        content: Schedule,
        title: ReactNode,
        eventTitle: ReactNode
    }
) => {

    const items: DescriptionsItemType[] = [
        {key: 1, label: 'Matière', children: content?.course?.course, span: 3},
        {key: 2, label: 'Prof', children: content?.teacher?.personalInfo?.lastName, span: 3},
    ]

    return(
        <Popover content={
            <Descriptions title={title} items={items} />
        }>
            <span>{eventTitle}</span>
        </Popover>
    )
}