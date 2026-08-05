import '../schedule-calendar.scss'
import {Classe, Schedule, ScheduleCalendarEvent} from "@/entity";
import Datetime from "@/core/datetime.ts";
import {useCallback, useEffect, useMemo, useState} from "react";
import {scheduleHelper} from "@/core/helpers/ScheduleHelpers.ts";
import {Button, Divider, Flex, message, Modal, Segmented} from "antd";
import {ScheduleInsertModal} from "@/components/ui-kit-schedule/components/ScheduleInsertModal.tsx";
import {transformEvents} from "@/core/utils/utils.ts";
import {ScheduleDetailsModal} from "@/components/ui-kit-schedule";
import {BigCalendar, ContextMenuItem, EventInteractionArgs, SlotInfo, View} from "@/components/graph/BigCalendar.tsx";
import {ApiEvent} from "@/core/utils/interfaces.ts";
import {Day} from "@/entity/enums/day.ts";
import {LuPen, LuTrash} from "react-icons/lu";
import {useScheduleRepo} from "@/hooks/actions/useScheduleRepo.ts";
import {catchError} from "@/data/action/error_catch.ts";
import {datehelper} from "@/core/helpers/DateHelpers.ts";
import {Messages} from "@/components/ui/layout/ConfirmationModal.tsx";
import {ScheduleSchema} from "@/schema";

interface PendingSlot {
    start: Date
    end: Date,
    event?: ScheduleCalendarEvent
}

interface ScheduleCalendarProps {
    schedules?: Schedule[]
    classe?: Classe,
    academicYear?: string,
    setRefresh?: () => void
    getMessages?: (messages: Messages | null) => void
}

const WEEK_VIEW_ONLY = ['week'] as View[]
const alwaysDraggable = () => true

export const DragAndDropScheduleCalendar = ({schedules, classe, academicYear, setRefresh, getMessages}: ScheduleCalendarProps) => {
    const [events, setEvents] = useState<ScheduleCalendarEvent[]>([])
    const [pendingSlot, setPendingSlot] = useState<PendingSlot | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [detailsEvent, setDetailsEvent] = useState<ScheduleCalendarEvent | null>(null)
    const [isClassic, setIsClassic] = useState<boolean>(false)

    const {useUpdateSchedule, useDeleteSchedule} = useScheduleRepo()
    const update = useUpdateSchedule()
    const remove = useDeleteSchedule()

    const apiEvents: ApiEvent<Schedule>[] = useMemo(() => schedules ? schedules?.map(s => ({
        id: s.id,
        event: scheduleHelper.scheduleTitle(s),
        dayOfWeek: s.dayOfWeek as Day,
        startTime: s.startTime as [number, number],
        endTime: s.endTime as [number, number],
        allDay: false,
        resource: s
    })) : [], [schedules])
    
    const allEvents: ScheduleCalendarEvent[] = useMemo(() => transformEvents(apiEvents), [apiEvents])
    const disabledRecurring = useMemo(() => schedules && schedules?.length > 0 ? schedules[0].dayOfWeek === 'ALL_DAYS' : undefined, [schedules])
    const dayValue = useMemo(() => disabledRecurring !== undefined ? Day.ALL_DAYS : Day.MONDAY, [disabledRecurring])
    const [allDay, setAllDay] = useState<Day>(dayValue)
    const isRecurring = useMemo(() => allDay !== 0, [allDay])
    
    useEffect(() => {
        setEvents(allEvents || [])
    }, [allEvents])

    // ---------- create ----------
    const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
        setPendingSlot({ start: slotInfo.start, end: slotInfo.end })
        setIsClassic(false)
        setIsFormOpen(true)
    }, [])

    // ---------- left click: details ----------
    const handleSelectEvent = useCallback((event: ScheduleCalendarEvent) => {
        setDetailsEvent(event)
    }, [])
    
    const handleUpdating = useCallback(
        (data: ScheduleSchema, event: ScheduleCalendarEvent, start: Date | string, end: Date | string) => {
        update.mutate({payload: data, onlyTime: true}, {
            onSuccess: () => {
                const updated: ScheduleCalendarEvent = { ...event, start: new Date(start), end: new Date(end) }
                setEvents((prev) => prev.map((e) => (e.id === event.id ? updated : e))) // instant, optimistic
            },
            onError: e => getMessages?.({error: catchError(e) as string})
        })
    }, [getMessages, update])

    // ---------- drag to move (day/time) ----------
    const moveEvent = useCallback(async ({ event, start, end }: EventInteractionArgs<ScheduleCalendarEvent>) => {
        if (event?.resource?.dayOfWeek === 'ALL_DAYS') {
            await message.warning("Daily-recurring classes can't be moved individually yet.")
            return
        }

        try {
            const data = {...event.resource, dayOfWeek: datehelper.dateToDay(start), startTime: Datetime.of(start).time(), endTime: Datetime.of(end).time()}
            handleUpdating(data, event, start, end)
        } catch {
            setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e))) // rollback
            await message.error("Couldn't move the class, please try again.")
        }
    }, [handleUpdating])

    // ---------- resize to change duration ----------
    const resizeEvent = useCallback(async ({ event, start, end }: EventInteractionArgs<ScheduleCalendarEvent>) => {
        getMessages?.(null)
        try {
            const data = {...event.resource, startTime: Datetime.of(start).time(), endTime: Datetime.of(end).time()}
            handleUpdating(data, event, start, end)
        } catch {
            setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e))) // rollback
            await message.error("Couldn't resize the class, please try again.")
        }
    }, [getMessages, handleUpdating])

    // ---------- right-click: modify ----------
    const handleModify = useCallback((event: ScheduleCalendarEvent) => {
        setPendingSlot({ start: event.start, end: event.end, event })
        setDetailsEvent(event)
        setIsClassic(false)
        setIsFormOpen(true)
    }, [])

    // ---------- right-click: delete ----------
    const handleDelete = useCallback((event: ScheduleCalendarEvent) => {
        Modal.confirm({
            title: 'Suppression de ce planning',
            content: `${event?.resource?.course?.course ?? event?.resource?.designation} sera supprimé.`,
            okText: 'Supprimé',
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    remove.mutate(event?.resource as Schedule, {
                        onSuccess: () => {
                            setEvents((prev) => prev.filter((e) => e.id !== event.id)) // instant, optimistic
                            getMessages?.({success: "Planning supprimé avec succès"})
                        },
                        onError: e => getMessages?.({error: catchError(e) as string})
                    })
                } catch {
                    setEvents((prev) => [...prev, event]) // rollback
                    await message.error("Couldn't delete the class, please try again.")
                }
            },
        })
    }, [getMessages, remove])

    // ---------- modal submit: create or modify teacher/course ----------
    const handleFormCancel = useCallback(() => {
        setRefresh?.()
        setDetailsEvent(null)
        setIsClassic(false)
        setIsFormOpen(false)
        setPendingSlot(null)
    }, [setRefresh])

    const handleDateName = useCallback((date: Date) => Datetime.of(date).DAY_NAME, [])

    console.log("ALL DAYS?: ", allDay, ' IS RECURRING: ', isRecurring)

    return(
        <section className="schedule-page">
            <Flex align='center' justify='space-between'>
                <Segmented defaultValue={dayValue} options={[
                    {label: 'Par jour', value: Day.MONDAY, disabled: disabledRecurring},
                    {label: 'Récurrent', value: Day.ALL_DAYS, disabled: disabledRecurring !== undefined ? !disabledRecurring : undefined}
                ]} onChange={v => setAllDay(v)} />
                <Button type='primary' onClick={() => {
                    setIsClassic(true)
                    setIsFormOpen(true)
                }}>
                    Ajout Classique
                </Button>
            </Flex>
            <Divider />
            <BigCalendar
                data={events}
                defaultView={'week'}
                views={WEEK_VIEW_ONLY}
                toolbar={false}
                formats={{dayFormat: handleDateName}}
                selectable
                resizable
                hasAddons
                contextMenuItems={(s: ScheduleCalendarEvent): ContextMenuItem[] => [
                    { key: 'edit', label: 'Modifier', icon: <LuPen />, onClick: () => handleModify(s) },
                    { key: 'delete', label: 'Supprimer', icon: <LuTrash />, danger: true, onClick: () => handleDelete(s) },
                ]}
                draggableAccessor={alwaysDraggable}
                onEventDrop={moveEvent}
                onEventResize={resizeEvent}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                startDayTime={[6, 0]}
                endDayTime={[19, 0]}
                height={800}
                showSelectionTime
            />
            {isFormOpen && <ScheduleInsertModal
                open={isFormOpen}
                slot={pendingSlot && {
                    start: pendingSlot.start,
                    end: pendingSlot.end,
                }}
                isRecurring={isRecurring}
                data={detailsEvent?.resource}
                academicYear={academicYear as string}
                classe={classe}
                onCancel={handleFormCancel}
                classic={isClassic}
            />}

            {detailsEvent && detailsEvent.resource && !isFormOpen && <ScheduleDetailsModal
                schedule={detailsEvent?.resource}
                open={!!detailsEvent}
                onCancel={() => setDetailsEvent(null)}
            />}
        </section>
    )
}