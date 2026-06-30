import {Calendar, dayjsLocalizer, View, Event} from 'react-big-calendar'
import dayjs from 'dayjs'
import {Skeleton} from "antd";
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'dayjs/locale/fr'
import {calendarMessages} from "@/core/utils/text_display.ts";
import {useState, useCallback} from "react";
import {BigCalendarProps, Moment} from "@/core/utils/interfaces.ts";
import Datetime from "../../core/datetime.ts";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {datehelper} from "@/core/helpers/DateHelpers.ts";

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('fr')

const localized = dayjsLocalizer(dayjs)

export const BigCalendar = <T extends object = Event>(
    {
        data, views, defaultView, startDayTime, endDayTime, startDate, endDate, className, styles, onSelectEvent, start, end,
        showNavButton, height, onSelectSlot, isLoading = false, wrapperColor, selectable = false,
    }: BigCalendarProps<T>
) => {

    const [view, setView] = useState<View>(defaultView)
    const [currentDate, setCurrentDate] = useState<Datetime>(datehelper.getDateReference(startDate, endDate));

    const handleOnChangeView = (selectedView: View) => {
        setView(selectedView)
    }

    const handleNavigate = useCallback(
        (newDate: Date) => {
            const start = Datetime.of(startDate as Moment)
            const end = Datetime.of(endDate as Moment)
            const current = Datetime.of(newDate)
            if (startDate && !endDate) {
                if (current.isBefore(startDate)) {
                    setCurrentDate(start);
                } else {
                    setCurrentDate(current);
                }
            }else if (!startDate && endDate) {
                if (current.isAfter(endDate)) {
                    setCurrentDate(end);
                } else {
                    setCurrentDate(current);
                }
            }else if (startDate && endDate) {
                if (current.isBefore(startDate)) {
                    setCurrentDate(start);
                } else if (current.isAfter(endDate)) {
                    setCurrentDate(end);
                } else {
                    setCurrentDate(current);
                }
            }else {
                setCurrentDate(current);
            }
        },
        [startDate, endDate]
    );

    const eventPropGetter = (event: Event) => {
        if (wrapperColor) {
            const [background, color] = wrapperColor(event)
            return {
                className: 'custom__wrapper',
                style: {
                    backgroundColor: background,
                    color: color,
                }
            }
        }
        return {}
    }

    const minDateTime = startDate
        ? Datetime.of(startDate).toDate()
        : Datetime.timeToCurrentDate(startDayTime || [7,0]).toDate();

    const maxDateTime = endDate
        ? Datetime.of(endDate).toDate()
        : Datetime.timeToCurrentDate(endDayTime || [19,0]).toDate();

    return (
        <>
        {
            isLoading ? <Skeleton active={true} loading={true}/> :
            <Calendar
                localizer={localized}
                events={data}
                startAccessor={start}
                endAccessor={end}
                views={views}
                view={view}
                date={currentDate.toDate()}
                style={{height: height ? `${height}px` : 'auto', ...styles}}
                min={minDateTime}
                max={maxDateTime}
                messages={calendarMessages}
                onView={handleOnChangeView}
                className={!showNavButton ? `big-calendar ${className}` : className}
                onSelectEvent={onSelectEvent}
                onSelectSlot={onSelectSlot}
                onNavigate={handleNavigate}
                selectable={selectable}
                eventPropGetter={eventPropGetter}
            />
        }
        </>
    )
}