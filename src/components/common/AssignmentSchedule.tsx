import {Assignment, Schedule} from "../../entity";
import {ReactNode, useEffect, useState} from "react";
import {SlotInfo, View} from "react-big-calendar";
import {CalendarEvent, EventProps} from "../../core/utils/interfaces.ts";
import {AssignmentTypeLiteral, typeColors} from "../../entity/enums/assignmentType.ts";
import {BigCalendar} from "../graph/BigCalendar.tsx";
import {AssignmentViewDesc} from "./AssignmentViewDesc.tsx";
import Datetime from "../../core/datetime.ts";

type AssignmentScheduleType = {
    eventTitle?: string | ReactNode | ((event: Schedule) => string)
    show?: boolean
    plus?: boolean
    eventSchedule?: Assignment[]
    views?: View[]
    height?: number
    isLoading?: boolean
    showBest?: boolean
    shareScoreSize?: (value: number) => void
    setRefetch?: (refetch: boolean) => void
    onlyMark?: string
    selectable?: boolean
    selectSlotAction?: (slots: SlotInfo) => void
    startDate?: Date | string | number[]
    endDate?: Date | string | number[]
}

export const AssignmentSchedule = (
    {
        eventSchedule, showBest = true, show = true, plus = true, shareScoreSize, setRefetch, onlyMark, views = ['month', 'week', 'agenda'],
        height, isLoading, selectable, selectSlotAction, startDate, endDate
    }: AssignmentScheduleType
) => {
    const [wasDeleted, setWasDeleted] = useState<Record<string, boolean>>({})
    const [wasUpdated, setWasUpdated] = useState<Record<string, boolean>>({})
    const [scoreSize, setScoreSize] = useState<number>(5)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)

    useEffect(() => {
        if (wasDeleted?.status || wasUpdated?.updated) {
            setIsModalOpen(false)
            if (setRefetch) {
                setRefetch(true)
            }
        }
    }, [setRefetch, wasDeleted?.status, wasUpdated?.updated])

    const eventData: CalendarEvent = eventSchedule ? eventSchedule?.map(assignment => ({
        title: assignment.examName,
        start: Datetime.of(assignment?.examDate as number[]).timeToDatetime(assignment?.startTime as number[]).toDate(),
        end: Datetime.of(assignment?.examDate as number[]).timeToDatetime(assignment?.endTime as number[]).toDate(),
        allDay: false,
        resource: assignment
    })): []

    function onEventSelected(event: EventProps) {
        setIsModalOpen(true)
        setSelectedAssignment?.(event.resource as Assignment)
    }

    function onModalCancel() {
        setIsModalOpen(false)
        setScoreSize(prev => prev > 5 ? 5 : prev)
        shareScoreSize && shareScoreSize(scoreSize)
    }

    return(
        <>
            <BigCalendar
                styles={{ height: height ?? 600 }}
                data={eventData as []}
                views={views}
                defaultView={views ?  views[0] : 'month'}
                onSelectEvent={onEventSelected}
                isLoading={isLoading}
                showNavButton
                wrapperColor={(event) => typeColors(
                    AssignmentTypeLiteral[event?.resource?.type as unknown as keyof typeof AssignmentTypeLiteral], true
                ) as [string, string]}
                selectable={selectable}
                startDate={startDate}
                endDate={endDate}
                onSelectSlot={selectSlotAction}
            />
            <AssignmentViewDesc
                assignment={selectedAssignment}
                modalTitle={selectedAssignment?.examName}
                isModal={true}
                isModalOpen={isModalOpen}
                onModalCancel={onModalCancel}
                show={show}
                plus={plus}
                showBest={showBest}
                onlyMark={onlyMark}
                setWasDeleted={setWasDeleted}
                setWasUpdated={setWasUpdated}
                scoreSize={scoreSize}
                showLink={true}
                setRefetch={setRefetch}
            />
        </>
    )
}