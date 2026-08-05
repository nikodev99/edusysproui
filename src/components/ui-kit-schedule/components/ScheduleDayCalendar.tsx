import {Schedule} from "@/entity";
import {setName, timeToCurrentDatetime} from "@/core/utils/utils.ts";
import Section from "../../ui/layout/Section.tsx";
import {BigCalendar} from "@/components/graph/BigCalendar.tsx";
import {ReactNode} from "react";
import {scheduleHelper} from "@/core/helpers/ScheduleHelpers.ts";

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
                ? `${schedule?.course?.course} - ${setName(schedule?.teacher?.personalInfo)}`
                : schedule?.course?.course
            : schedule?.designation,
        start: schedule.startTime ? timeToCurrentDatetime(schedule.startTime) : new Date(),
        end: schedule.endTime ? timeToCurrentDatetime(schedule.endTime): new Date(),
        allDay: false
    }))

    const {minStartTime, maxEndTime} = scheduleHelper.getMinMaxTimes(eventSchedule)

    return(
        <Section title={sectionTitle} more={seeMore !== undefined} seeMore={seeMore}>
            <BigCalendar
                data={events as []}
                views={['day']}
                defaultView='day'
                startDayTime={minStartTime}
                endDayTime={[maxEndTime[0], maxEndTime[1]]}
                height={400}
            />
        </Section>
    )
}
