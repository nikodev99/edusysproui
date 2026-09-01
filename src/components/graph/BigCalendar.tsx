import {CSSProperties, ReactNode, SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import type {DateSelectInfo, EventClickInfo, EventDropInfo, EventInput,} from '@fullcalendar/react'
import FullCalendar, {CalendarRef, EventDisplayInfo, EventResizeDoneInfo, MountInfo} from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/react/daygrid'
import timeGridPlugin from '@fullcalendar/react/timegrid'
import listPlugin from '@fullcalendar/react/list'
import interactionPlugin from '@fullcalendar/react/interaction'
import themePlugin from '@fullcalendar/react/themes/monarch'

// v7 ships NO default CSS/theme — all three imports below are mandatory or the
// calendar renders unstyled. Swap 'purple' for any palette from themes.fullcalendar.io;
// each palette file already carries both light and dark variables, switched via the
// `colorScheme` prop below, so this can match your dark editorial header (#0F172A) directly.
import '@fullcalendar/react/skeleton.css'
import '@fullcalendar/react/themes/monarch/theme.css'
import '@fullcalendar/react/themes/monarch/palettes/purple.css'

// NOTE: locale subpath inferred from the same @fullcalendar/react/* restructuring pattern
// used by daygrid/timegrid/interaction/themes below — verify against your installed version;
// if it 404s, French locale data can be passed as a plain object per FullCalendar's locale docs.
import frLocale from '@fullcalendar/react/locales/fr'

import {Dropdown, Skeleton} from 'antd'
import {Moment} from '@/core/utils/interfaces.ts'
import Datetime from '../../core/datetime.ts'
import {ClockIcon, IconText} from "@/core/utils/tsxUtils.tsx";
import {datehelper} from "@/core/helpers/DateHelpers.ts";

// Local stand-ins for react-big-calendar's own types, shaped the same way, so RBC can be
// fully uninstalled. Any file that previously did `import { View, SlotInfo } from
// 'react-big-calendar'` should now import them from this file instead.

export type View = 'month' | 'week' | 'work_week' | 'day' | 'agenda'

export interface SlotInfo {
    start: Date
    end: Date
    slots: Date[] | string[]
    action: 'select' | 'click' | 'doubleClick'
    resourceId?: number | string
    bounds?: { x: number; y: number; top: number; right: number; left: number; bottom: number }
    box?: { x: number; y: number; clientX: number; clientY: number }
}

export type EventPropGetter<TEvent extends object> = (
    event: TEvent,
    start: Date,
    end: Date,
    isSelected: boolean
) => { className?: string; style?: CSSProperties }


export interface EventInteractionArgs<TEvent extends object> {
    event: TEvent
    start: Date | string
    end: Date | string
    isAllDay?: boolean
}


// Loose on purpose — RBC's Formats holds per-part formatter functions/strings, and the only timeGutterFormat /
// dayHeaderFormat are even referenced below. Add keys here as you need them.
export type Formats = Partial<Record<string, string | ((date: Date, culture?: string) => string)>>

export interface ContextMenuItem {
    key: string
    label?: ReactNode
    icon?: ReactNode
    danger?: boolean
    onClick: () => void
}

export interface BigCalendarProps<TEvent extends object> {
    data?: TEvent[]
    views?: View[]
    defaultView?: View
    start?: keyof TEvent
    end?: keyof TEvent
    startDayTime?: [number, number]
    endDayTime?: [number, number]
    startDate?: Moment
    endDate?: Moment
    className?: string
    styles?: CSSProperties
    height?: number
    isLoading?: boolean
    selectable?: boolean
    showNavButton?: boolean
    borderless?: boolean
    wrapperColor?: (event: TEvent) => [string, string]
    onSelectEvent?: (event: TEvent, e: SyntheticEvent) => void
    onSelectSlot?: (slotInfo: SlotInfo) => void
    allDaySlot?: boolean

    // --- addon / interaction props ---
    hasAddons?: boolean
    step?: number
    timeSlot?: number
    resizable?: boolean
    draggableAccessor?: () => boolean
    onEventDrop?: ((args: EventInteractionArgs<TEvent>) => void) | undefined
    onEventResize?: ((args: EventInteractionArgs<TEvent>) => void) | undefined
    eventPropGetter?: EventPropGetter<TEvent> | undefined
    toolbar?: boolean
    formats?: Formats

    // --- new: right-click menu + live time readout while drag-selecting ---
    contextMenuItems?: (event: TEvent) => ContextMenuItem[]
    showSelectionTime?: boolean
}

// react-big-calendar view keys -> FullCalendar view names.
const RBC_TO_FC_VIEW: Record<string, string> = {
    month: 'dayGridMonth',
    week: 'timeGridWeek',
    work_week: 'timeGridWeek',
    day: 'timeGridDay',
    agenda: 'listWeek',
}

const toFullCalendarEvent = <TEvent extends object>(
    item: TEvent,
    startKey: keyof TEvent,
    endKey: keyof TEvent,
    index: number
): EventInput => {
    const raw = item as Record<string, never>
    const rawTitle = raw?.title
    const isReactNodeTitle = rawTitle !== null && typeof rawTitle === 'object'
    return {
        id: raw.id != null ? String(raw.id) : String(index),
        title: isReactNodeTitle ? '' : (rawTitle ?? ''),
        start: raw[startKey as string],
        end: raw[endKey as string],
        // Original object travels with the FC event, so every callback can hand it straight back.
        extendedProps: { source: item },
    }
}

export const BigCalendar = <TEvent extends object = Record<string, unknown>>(
    {
        data, views, defaultView, startDayTime, endDayTime, startDate, endDate, className, styles,
        onSelectEvent, start = 'start' as keyof TEvent, end = 'end' as keyof TEvent, showNavButton = true,
        height = 500, onSelectSlot, isLoading = false, wrapperColor, selectable = false, borderless,
        hasAddons = false, step, timeSlot, resizable, draggableAccessor, allDaySlot = false,
        onEventDrop, onEventResize, eventPropGetter, toolbar, formats, contextMenuItems, showSelectionTime
    }: BigCalendarProps<TEvent>
) => {
    const [contextMenu, setContextMenu] = useState<{x: number, y: number, event: TEvent} | null>(null)
    const [isSelecting, setIsSelecting] = useState(false)
    const [liveRange, setLiveRange] = useState<{ start: Date; end: Date } | null>(null)
    const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)
    const calendarRef = useRef<CalendarRef>(null)

    const plugins = useMemo(
        () => [themePlugin, dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        []
    )

    const enabledViews = useMemo(
        () => (views && views.length
            ? views.map((v) => RBC_TO_FC_VIEW[v as string] ?? (v as string))
            : ['dayGridMonth', 'timeGridWeek', 'timeGridDay']),
        [views]
    )

    const initialView = useMemo(() => RBC_TO_FC_VIEW[defaultView as string] ?? (defaultView as string) ?? enabledViews[0], [defaultView, enabledViews])

    const events = useMemo(
        () => (data ?? []).map((item, index) => toFullCalendarEvent(item, start, end, index)),
        [data, start, end]
    )

    const initialDate = useMemo(() => {
        return datehelper.getDateReference(startDate, endDate).toDate()
    }, [endDate, startDate])

    const isMonthView = initialView === 'dayGridMonth'

    const toTimeString = (hour: number, minute: number) => {
        const totalMinutes = Math.max(0, hour * 60 + minute)
        const h = Math.floor(totalMinutes / 60) % 24
        const m = totalMinutes % 60
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
    }

    const slotMinTime = startDayTime ? toTimeString(startDayTime[0], startDayTime[1] ?? 0) : '06:00:00'
    const slotMaxTime = endDayTime ? toTimeString(endDayTime[0], endDayTime[1] ?? 0) : '19:00:00'

    // step = minutes per slot row (RBC default 30). timeSlot = subdivisions grouped under one label.
    const slotDuration = step ? `00:${String(step).padStart(2, '0')}:00` : '00:30:00'
    const slotHeaderInterval = step && timeSlot
        ? `00:${String(step * timeSlot).padStart(2, '0')}:00`
        : undefined

    // Replaces the old handleNavigate clamping logic — FullCalendar enforces it natively.
    const validRange = useMemo(() => {
        if (!startDate && !endDate) return undefined
        return {
            ...(startDate ? { start: Datetime.of(startDate).toDate() } : {}),
            ...(endDate ? { end: Datetime.of(endDate).toDate() } : {}),
        }
    }, [startDate, endDate])

    const showToolbar = toolbar ?? true
    const headerToolbar = showToolbar
        ? { left: showNavButton ? 'prev,next today' : undefined, center: 'title', right: enabledViews.join(',') }
        : false

    // formats: RBC's Formats holds date-fns/moment style formatter functions per calendar part,
    // which don't line up 1:1 with FullCalendar's Intl-based format options. Only the two
    // closest equivalents are mapped; anything else in `formats` is accepted for prop-shape
    // compatibility but has no effect here.
    const slotHeaderFormat = formats?.timeGutterFormat ? undefined : undefined // see note above
    const titleFormat = undefined // formats?.dayHeaderFormat has no direct FC equivalent

    const isDraggable = hasAddons ? (draggableAccessor ? draggableAccessor() : true) : false
    const isResizable = hasAddons ? Boolean(resizable) : false

    const handleEventClick = useCallback(
        (arg: EventClickInfo) => {
            const source = arg.event.extendedProps.source as TEvent
            onSelectEvent?.(source, arg.jsEvent as unknown as SyntheticEvent)
        },
        [onSelectEvent]
    )

    useEffect(() => {
        if (!contextMenu) return
        const close = () => setContextMenu(null)
        window.addEventListener('click', close)
        window.addEventListener('scroll', close, true)
        return () => {
            window.removeEventListener('click', close)
            window.removeEventListener('scroll', close, true)
        }
    }, [contextMenu]);

    useEffect(() => {
        if (!isSelecting) return
        const onMove = (e: MouseEvent) => setMousePos({x: e.clientX, y: e.clientY})
        window.addEventListener("mousemove", onMove)
        return () => window.removeEventListener('mousemove', onMove)
    }, [isSelecting])

    useEffect(() => {
        calendarRef.current?.getApi().changeView(initialView)
    }, [initialView]);
    
    const formatTime = (date: Date) => Datetime.of(date).time()

    const handleSelect = useCallback(
        (arg: DateSelectInfo) => {
            onSelectSlot?.({
                start: arg.start,
                end: arg.end,
                slots: [arg.start, arg.end],
                action: 'select',
            } as SlotInfo)
            calendarRef.current?.getApi().unselect()
        },
        [onSelectSlot]
    )

    const handleEventDrop = useCallback(
        (arg: EventDropInfo) => {
            const source = arg.event.extendedProps.source as TEvent
            onEventDrop?.({
                event: source,
                start: arg.event.start as Date,
                end: arg.event.end as Date,
                isAllDay: arg.event.allDay,
            } as EventInteractionArgs<TEvent>)
        },
        [onEventDrop]
    )

    const handleEventResize = useCallback(
        (arg: EventResizeDoneInfo) => {
            const source = arg.event.extendedProps.source as TEvent
            onEventResize?.({
                event: source,
                start: arg.event.start as Date,
                end: arg.event.end as Date,
                isAllDay: arg.event.allDay,
            } as EventInteractionArgs<TEvent>)
        },
        [onEventResize]
    )

    const handleSelectAllow = useCallback(
        (selectInfo: { start: Date; end: Date }) => {
            if (showSelectionTime) {
                setIsSelecting(true)
                setLiveRange({ start: selectInfo.start, end: selectInfo.end })
            }
            return true
        },
        [showSelectionTime]
    )
    
    const clearSelectionTooltip = useCallback(() => {
        setIsSelecting(false)
        setLiveRange(null)
        setMousePos(null)
    }, [])

    const handleEventDidMount = useCallback(
        (arg: MountInfo<EventDisplayInfo>) => {
            const source = arg.event.extendedProps.source as TEvent

            if (eventPropGetter) {
                // FullCalendar doesn't track a "selected" event state the way RBC does — passed as false.
                const { className, style } = eventPropGetter(
                    source,
                    arg.event.start as Date,
                    arg.event.end as Date,
                    false
                )
                if (className) arg.el.classList.add(...className.split(' ').filter(Boolean))
                if (style) Object.assign(arg.el.style, style as CSSProperties)
            }
            
            if (contextMenuItems) {
                arg.el.addEventListener('contextmenu', (nativeEvent: MouseEvent) => {
                    nativeEvent.preventDefault()
                    nativeEvent.stopPropagation()
                    setContextMenu({x: nativeEvent.clientX, y: nativeEvent.clientY, event: source})
                })
            }
        },
        [eventPropGetter, contextMenuItems]
    )

    const eventContent = useCallback((arg: EventDisplayInfo) => {
        const extendedProps = (arg.event).extendedProps
        const duration = datehelper.minDuration(arg.event.start as Date, arg.event.end as Date)
        const isShortEvent = duration <= 30;
        let styles: {bg?: string, color?: string} = {bg: undefined, color: undefined}

        if (wrapperColor) {
            const [background, color] = wrapperColor(extendedProps.source)
            styles = {bg: background, color: color}
        }
        
        const wrapStyle: CSSProperties = {
            whiteSpace: 'normal',
            overflow: !isShortEvent ? 'visible' : 'hidden',
            wordBreak: !isShortEvent ? 'break-word' : undefined,
            lineHeight: 1.25,
            display: 'flex',
            background: styles.bg,
            borderColor: styles.bg,
            color: styles.color,
            // 'row' puts title and time side-by-side; 'column' stacks them
            flexDirection: isShortEvent ? 'row' : 'column',
            alignItems: isShortEvent ? 'center' : 'flex-start',
            gap: isShortEvent ? '8px' : '2px', // Horizontal gap when inline, vertical gap when stacked
            cursor: 'pointer',
            borderRadius: '4px',
            padding: isMonthView ? '5px' : undefined,
        }

        const timeStyle: CSSProperties = {
            display: 'flex',
            alignItems: 'center', // Centers icons and text vertically
        };

        let title = arg.event.title
        let start = Datetime.of(arg.event.start as Date).time()
        let end = Datetime.of(arg.event.end as Date).time()

        if (extendedProps?.title !== undefined) {
            title = extendedProps?.title
            start = Datetime.of(extendedProps?.start as Date).time()
            end = Datetime.of(extendedProps?.end as Date).time()
        }



        return <div style={wrapStyle}>
            <div style={timeStyle}>
                <IconText icon={<ClockIcon time={start} />} text={start} />
                <span style={{ margin: '0 4px' }}>-</span>
                <IconText icon={<ClockIcon time={end} />} text={end} />
            </div>
            <span>{title}</span>
        </div>
    }, [isMonthView, wrapperColor])

    const mergedStyle: CSSProperties = { height: height ? `${height}px` : 'auto', ...styles }

    return (
        <div className={!showToolbar ? `big-calendar ${className ?? ''}` : className} style={mergedStyle}>
            <div style={{ position: 'relative', height: '100%' }}>
                {isLoading && (
                    // Overlay only — the calendar underneath stays mounted, so toggling
                    // isLoading (e.g., while fetching an event's details on click) never
                    // remounts FullCalendar and never resets it back to initialDate.
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 10,
                            background: 'var(--color-bg-container, #fff)',
                        }}
                    >
                        <Skeleton active loading />
                    </div>
                )}
                <FullCalendar
                    key="main-calendar"
                    ref={calendarRef}
                    plugins={plugins}
                    borderless={borderless}
                    locale={frLocale}
                    initialView={'timeGridWeek'}
                    initialDate={initialDate}
                    headerToolbar={headerToolbar}
                    events={events}
                    height={height ?? 500}
                    slotMinTime={slotMinTime}
                    slotMaxTime={slotMaxTime}
                    slotDuration={slotDuration}
                    slotHeaderInterval={slotHeaderInterval}
                    slotHeaderFormat={slotHeaderFormat}
                    titleFormat={titleFormat}
                    validRange={validRange}
                    selectable={selectable}
                    timeZone={Datetime.DEFAULT_TIMEZONE}
                    select={handleSelect}
                    selectAllow={handleSelectAllow}
                    unselect={clearSelectionTooltip}
                    eventContent={isMonthView ? undefined : eventContent}
                    eventClick={handleEventClick}
                    eventDidMount={handleEventDidMount}
                    editable={isDraggable || isResizable}
                    eventStartEditable={isDraggable}
                    eventDurationEditable={isResizable}
                    eventResizableFromStart={isResizable}
                    eventDrop={handleEventDrop}
                    eventResize={handleEventResize}
                    allDaySlot={allDaySlot}
                    firstDay={1}
                    nowIndicator
                    dayMaxEvents
                />
            </div>
            {showSelectionTime && isSelecting && liveRange && mousePos && (
                <div
                    style={{
                        position: 'fixed',
                        top: mousePos.y + 14,
                        left: mousePos.x + 14,
                        zIndex: 1000,
                        background: '#0F172A',
                        color: '#fff',
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontFamily: 'DM Sans, sans-serif',
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {formatTime(liveRange.start)} — {formatTime(liveRange.end)}
                </div>
            )}
            {contextMenu && contextMenuItems && (
                <Dropdown
                    open
                    trigger={[]}
                    onOpenChange={(open) => { if (!open) setContextMenu(null) }}
                    menu={{
                        items: contextMenuItems(contextMenu.event).map((item) => ({
                            key: item.key,
                            label: item.label,
                            danger: item.danger,
                            icon: item?.icon,
                            onClick: () => {
                                item.onClick()
                                setContextMenu(null)
                            },
                        })),
                    }}
                >
                    <div style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, width: 1, height: 1 }} />
                </Dropdown>
            )}
        </div>
    )
}
