import {isValidElement, ReactNode, useEffect, useState} from "react";
import {Schedule} from "../../entity";
import {useRawFetch} from "../../hooks/useFetch.ts";
import {ApiEvent, EventProps} from "../../utils/interfaces.ts";
import {Day} from "../../entity/enums/day.ts";
import {fDate, getMinMaxTimes, setTime, transformEvents} from "../../utils/utils.ts";
import {DescriptionsItemType} from "antd/es/descriptions";
import {text} from "../../utils/text_display.ts";
import {IconText} from "../../utils/tsxUtils.tsx";
import {LuCalendarDays, LuClock, LuClock9} from "react-icons/lu";
import {AvatarTitle} from "../ui/layout/AvatarTitle.tsx";
import PageWrapper from "../view/PageWrapper.tsx";
import {BigCalendar} from "../graph/BigCalendar.tsx";
import {Card, Descriptions, Modal, Tag} from "antd";
import {AxiosResponse} from "axios";
import {SectionType} from "../../entity/enums/section.ts";

type ScheduleCalendarProps = {
    fetchFunc: (...args: unknown[]) =>  Promise<AxiosResponse<Schedule>>
    funcParams: unknown[]
    eventTitle?: string | ReactNode | ((event: Schedule) => string)
    showClass?: boolean
    showTeacher?: boolean
}

export const ScheduleCalendar = ({fetchFunc, funcParams, eventTitle, showClass, showTeacher = true}: ScheduleCalendarProps) => {
    const [schedules, setSchedules] = useState<Schedule[] | null>(null)
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const fetch = useRawFetch()

    useEffect(() => {
        fetch(fetchFunc, funcParams)
            .then(resp => {
                if (resp.isSuccess) {
                    setSchedules(resp.data as Schedule[])
                }
            })
    }, [fetch, fetchFunc, funcParams]);

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
            ...(show ? [{key: 1, label: 'Matière', children: a?.course?.course, span: 3}] : []),
            {key: 2, label: text.academicYear.name, children: a?.academicYear?.academicYear, span: 3},
            ...(a && plus ? [{key: 3, label: undefined, children: <IconText color='#8f96a3' icon={<LuCalendarDays />} text={'start' in a ? fDate(a.start as Date, 'DD/MM/YYYY') : undefined} key="1" />}]: []),
            ...(a && plus ? [{key: 4, label: undefined, children: <IconText color='#8f96a3' icon={<LuClock />} text={setTime(a?.startTime as []) as string} key="2" />}]: []),
            ...(a && plus ? [{key: 5, label: undefined, children: <IconText color='#8f96a3' icon={<LuClock9 />} text={setTime(a?.endTime as []) as string} key="3" />}]: []),
            ...(showClass ? [{key: 6, label: 'Classe', children: <Tag color='#bd081c'>{a?.classe?.name}</Tag>, span: 2}] : []),
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
        setIsModalOpen(true)
        setSelectedSchedule(event.resource as Schedule)
    }

    function onModalCancel() {
        setIsModalOpen(false)
    }

    const {minStartTime, maxEndTime} = getMinMaxTimes(schedules || [])

    return(
        <>
            <PageWrapper>
                <BigCalendar
                    data={events as []}
                    views={['week', 'day']}
                    defaultView={'week'}
                    className='agenda'
                    onSelectEvent={onEventSelected}
                    height={500}
                    startDayTime={minStartTime}
                    endDayTime={maxEndTime}
                />
            </PageWrapper>
            <Modal title={selectedSchedule?.designation} open={isModalOpen} footer={null} onCancel={onModalCancel} destroyOnClose>
                <Card>
                    <Descriptions items={assignmentDesc(
                        selectedSchedule as Schedule,
                        (selectedSchedule?.course?.course !== null && selectedSchedule?.teacher !== null),
                        true)}
                    />
                </Card>
            </Modal>
        </>
    )
}