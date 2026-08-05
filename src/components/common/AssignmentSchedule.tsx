import {Assignment, Schedule} from "@/entity";
import {ReactNode, useMemo, useState} from "react";
import {AssignmentTypeLiteral, typeColors} from "@/entity/enums/assignmentType.ts";
import {BigCalendar, SlotInfo, View} from "@/components/graph/BigCalendar.tsx";
import {AssignmentViewDesc} from "./AssignmentViewDesc.tsx";
import Datetime from "@/core/datetime.ts";
import {AssignmentCalendarEvents} from "@/entity/domain/assignment.ts";

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
    selectSlotAction?: (slotInfo: SlotInfo) => void
    startDate?: Date | string | number[]
    endDate?: Date | string | number[]
}

export const AssignmentSchedule = (
    {
        eventSchedule, showBest = true, show = true, plus = true, shareScoreSize, setRefetch, onlyMark,
        height, selectable, selectSlotAction, startDate, endDate
    }: AssignmentScheduleType
) => {
    const [scoreSize, setScoreSize] = useState<number>(5)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)

    const eventData = useMemo(() => eventSchedule ? eventSchedule?.map(assignment => ({
        id: assignment?.id as number,
        title: assignment.examName as string,
        start: Datetime.of(assignment?.examDate as number[]).timeToDatetime(assignment?.startTime as number[]).toDate(),
        end: Datetime.of(assignment?.examDate as number[]).timeToDatetime(assignment?.endTime as number[]).toDate(),
        allDay: false,
        resource: assignment
    })) : [], [eventSchedule])

    function onEventSelected(event: AssignmentCalendarEvents) {
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
                key={selectedAssignment?.id}
                height={height ?? 600}
                data={eventData as []}
                views={["month", 'week', 'agenda']}
                defaultView={'month'}
                onSelectEvent={onEventSelected}
                showNavButton
                wrapperColor={(event) => typeColors(
                    AssignmentTypeLiteral[event?.resource?.type as unknown as keyof typeof AssignmentTypeLiteral], true
                ) as [string, string]}
                selectable={selectable}
                startDate={startDate}
                endDate={endDate}
                onSelectSlot={selectSlotAction}
            />
            {selectedAssignment && <AssignmentViewDesc
                assignment={selectedAssignment}
                modalTitle={selectedAssignment?.examName}
                isModal={true}
                isModalOpen={isModalOpen}
                onModalCancel={onModalCancel}
                show={show}
                plus={plus}
                showBest={showBest}
                onlyMark={onlyMark}
                scoreSize={scoreSize}
                showLink={true}
                setRefetch={setRefetch}
            />}
        </>
    )
}