import {ReactNode, useEffect, useState} from "react";
import {Schedule, ScheduleCalendarEvent} from "@/entity";
import {useRawFetch} from "@/hooks/useFetch.ts";
import {ApiEvent, Color} from "@/core/utils/interfaces.ts";
import {Day} from "@/entity/enums/day.ts";
import {transformEvents} from "@/core/utils/utils.ts";
import {BigCalendar, View} from "@/components/graph/BigCalendar.tsx";
import {AxiosResponse} from "axios";
import Datetime from "@/core/datetime.ts";
import VoidData from "@/components/view/VoidData.tsx";
import {scheduleHelper} from "@/core/helpers/ScheduleHelpers.ts";
import {ScheduleDetailsModal} from "@/components/ui-kit-schedule";

type ScheduleCalendarProps = {
    fetchFunc?: (...args: unknown[]) =>  Promise<AxiosResponse<Schedule>>
    funcParams?: unknown[]
    eventTitle?: string | ReactNode | ((event: Schedule) => string)
    showClass?: boolean
    showTeacher?: boolean
    hasTeacher?: boolean
    eventSchedule?: Schedule[]
    views?: View[]
    height?: number
    color?: Color
    isLoading?: boolean
    toolbar?: boolean
}

export const ScheduleCalendar = (
    {
        fetchFunc, funcParams, eventTitle, showClass = true, showTeacher = true, toolbar = true,
        eventSchedule, views = ['week', 'day'], hasTeacher, height = 600, color, isLoading = false,
    }: ScheduleCalendarProps
) => {
    const [schedules, setSchedules] = useState<Schedule[] | null>(null)
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const fetch = useRawFetch()

    useEffect(() => {
        if (fetchFunc)
            fetch(fetchFunc, funcParams)
            .then(resp => {
                if (resp.isSuccess) {
                    setSchedules(resp.data as Schedule[])
                }
            })
        
        if (eventSchedule)
            setSchedules(eventSchedule)

    }, [fetch, fetchFunc, funcParams, eventSchedule]);

    const apiEvents: ApiEvent<Schedule>[] = schedules ? schedules?.map(s => ({
        event: eventTitle ? scheduleHelper.setTitle(s, eventTitle) : scheduleHelper.scheduleTitle(s),
        dayOfWeek: s.dayOfWeek as Day,
        startTime: s.startTime as [number, number],
        endTime: s.endTime as [number, number],
        allDay: false,
        resource: s
    })) : []

    const events = transformEvents(apiEvents as [])

    function onEventSelected(event: ScheduleCalendarEvent) {
        if (hasTeacher) {
            setIsModalOpen(true)
            setSelectedSchedule(event.resource as Schedule)
        }
    }

    function onModalCancel() {
        setIsModalOpen(false)
    }

    const {minStartTime, maxEndTime} = scheduleHelper.getMinMaxTimes(schedules || [])

    return(
        <>
            {
                events && events?.length > 0 ?
                    (
                        <BigCalendar
                            data={events as []}
                            views={views}
                            defaultView={views ?  views[0] : 'week'}
                            className='agenda'
                            onSelectEvent={onEventSelected}
                            height={height}
                            startDayTime={[minStartTime[0], minStartTime[1]]}
                            endDayTime={[maxEndTime[0], maxEndTime[1]]}
                            isLoading={isLoading}
                            toolbar={toolbar}
                            borderless={true}
                        />
                    ) :
                    (
                        <VoidData title={<em>Pas de cours ce jour, {Datetime.now().fullDay()}</em>} />
                    )
            }

            {selectedSchedule && isModalOpen && <ScheduleDetailsModal
                schedule={selectedSchedule}
                open={isModalOpen}
                onCancel={onModalCancel}
                showClass={showClass}
                showTeacher={showTeacher}
                color={color}
            />}
        </>
    )
}