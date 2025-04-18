import {isValidElement, ReactNode, useEffect, useState} from "react";
import {Schedule} from "../../entity";
import {useRawFetch} from "../../hooks/useFetch.ts";
import {ApiEvent, Color, EventProps} from "../../core/utils/interfaces.ts";
import {Day} from "../../entity/enums/day.ts";
import {fDate, getMinMaxTimes, setTime, transformEvents} from "../../core/utils/utils.ts";
import {DescriptionsItemType} from "antd/es/descriptions";
import {text} from "../../core/utils/text_display.ts";
import {IconText} from "../../core/utils/tsxUtils.tsx";
import {LuCalendarDays, LuClock, LuClock9} from "react-icons/lu";
import {AvatarTitle} from "../ui/layout/AvatarTitle.tsx";
import {BigCalendar} from "../graph/BigCalendar.tsx";
import {Card, Descriptions, Modal, Tag} from "antd";
import {AxiosResponse} from "axios";
import {SectionType} from "../../entity/enums/section.ts";
import {View} from "react-big-calendar";
import Datetime from "../../core/datetime.ts";
import VoidData from "../view/VoidData.tsx";

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
}

export const ScheduleCalendar = (
    {
        fetchFunc, funcParams, eventTitle, showClass = true, showTeacher = true,
        eventSchedule, views = ['week', 'day'], hasTeacher, height = 500, color, isLoading = false,
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

    const setTitle = (schedule: Schedule): string | ReactNode => {
        if (eventTitle) {
            if (typeof eventTitle === "function") {
                return eventTitle(schedule);
            }
            if(isValidElement(eventTitle) || typeof eventTitle === "string") {
                return eventTitle;
            }
        }
        return `${schedule?.course.course ? schedule.course.course : schedule.designation}`
    }

    const apiEvents: ApiEvent<Schedule>[] = schedules ? schedules?.map(s => ({
        event: setTitle(s),
        dayOfWeek: s.dayOfWeek as Day,
        startTime: s.startTime as [number, number],
        endTime: s.endTime as [number, number],
        allDay: false,
        resource: s
    })) : []

    const events = transformEvents(apiEvents as [])

    const assignmentDesc = (a: Schedule, show?: boolean, plus?: boolean): DescriptionsItemType[] => {
        return [
            {key: 1, label: 'Matière', children: a?.course?.course ? a?.course?.course : a?.designation, span: 3},
            {key: 2, label: text.academicYear.name, children: a?.academicYear?.academicYear, span: 3},
            ...(a && plus ? [{key: 3, label: undefined, children: <IconText color='#8f96a3' icon={<LuCalendarDays />} text={'start' in a ? fDate(a.start as Date, 'DD/MM/YYYY') : undefined} key="1" />}]: []),
            ...(a && plus ? [{key: 4, label: undefined, children: <IconText color='#8f96a3' icon={<LuClock />} text={setTime(a?.startTime as []) as string} key="2" />}]: []),
            ...(a && plus ? [{key: 5, label: undefined, children: <IconText color='#8f96a3' icon={<LuClock9 />} text={setTime(a?.endTime as []) as string} key="3" />}]: []),
            ...(showClass ? [{key: 6, label: 'Classe', children: <Tag color={color ?? '#bd081c'}>{a?.classe?.name}</Tag>, span: 2}] : []),
            ...(showClass ? [{key: 7, label: 'Grade', children: SectionType[a?.classe?.grade?.section as unknown as keyof typeof SectionType]}] : []),
            ...((showTeacher && show) ? [{key: 8, label: text.teacher.label, children: '', span: 3}] : []),
            ...((showTeacher && show) ? [{key: 9, children: <AvatarTitle
                    lastName={a?.teacher?.personalInfo?.lastName}
                    firstName={a?.teacher?.personalInfo?.firstName}
                    image={a?.teacher?.personalInfo?.image}
                    size={32}
                />, span: 3 }] : [])
        ]
    }

    function onEventSelected(event: EventProps) {
        if (hasTeacher) {
            setIsModalOpen(true)
            setSelectedSchedule(event.resource as Schedule)
        }
    }

    function onModalCancel() {
        setIsModalOpen(false)
    }

    const {minStartTime, maxEndTime} = getMinMaxTimes(schedules || [])

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
                            startDayTime={minStartTime}
                            endDayTime={[maxEndTime[0], maxEndTime[1] + 30]}
                            isLoading={isLoading}
                        />
                    ) :
                    (
                        <VoidData title={<em>Pas de cours ce jour, {Datetime.now().format('dddd DD MMMM YYYY')}</em>} />
                    )
            }

            <Modal title={selectedSchedule?.designation} open={isModalOpen} footer={null} onCancel={onModalCancel} destroyOnClose>
                <Card>
                    <Descriptions items={assignmentDesc(
                        selectedSchedule as Schedule,
                        !!selectedSchedule?.teacher && !!selectedSchedule?.course?.course,
                        true)}
                    />
                </Card>
            </Modal>
        </>
    )
}