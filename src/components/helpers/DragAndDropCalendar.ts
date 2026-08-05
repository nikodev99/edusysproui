import {Calendar, CalendarProps} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {ComponentType} from "react";

export interface EventInteractionArgs<TEvent> {
    event: TEvent,
    start: Date | string,
    end: Date | string,
    isAllDay?: boolean
}

export interface DragAndDropCalendarProps<TEvent extends object> extends CalendarProps<TEvent> {
    onEventDrop?: (args: EventInteractionArgs<TEvent>) => void
    onEventResize?: (args: EventInteractionArgs<TEvent>) => void
    resizable?: boolean
    draggableAccessor?: (event: TEvent) => boolean
}

export const createDnDCalendar = <TEvent extends object>() => {
    return withDragAndDrop(Calendar) as ComponentType<DragAndDropCalendarProps<TEvent>>
}