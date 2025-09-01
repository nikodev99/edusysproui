import {Calendar, dayjsLocalizer, View, Event} from 'react-big-calendar'
import dayjs from 'dayjs'
import {Skeleton} from "antd";
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'dayjs/locale/fr'
import {calendarMessages} from "../../core/utils/text_display.ts";
import {useState, useCallback} from "react";
import {BigCalendarProps} from "../../core/utils/interfaces.ts";
import Datetime from "../../core/datetime.ts";

dayjs.locale('fr')
const localized = dayjsLocalizer(dayjs)

export const BigCalendar = <T extends object = Event>(
    {
        data, views, defaultView, startDayTime, endDayTime, startDate, endDate, className, styles, onSelectEvent, start, end,
        showNavButton, height, onSelectSlot, isLoading = false, wrapperColor, selectable = false,
    }: BigCalendarProps<T>
) => {

    const [view, setView] = useState<View>(defaultView)
    const [currentDate, setCurrentDate] = useState<Date | number[] | string | undefined>(startDate);

    const handleOnChangeView = (selectedView: View) => {
        setView(selectedView)
    }

    const handleNavigate = useCallback(
        (newDate: Date) => {
            if (startDate && !endDate) {
                if (Datetime.of(newDate).isBefore(startDate)) {
                    setCurrentDate(startDate);
                } else {
                    setCurrentDate(newDate);
                }
            }else if (!startDate && endDate) {
                if (Datetime.of(newDate).isAfter(endDate)) {
                    setCurrentDate(endDate);
                } else {
                    setCurrentDate(newDate);
                }
            }else if (startDate && endDate) {
                if (Datetime.of(newDate).isBefore(startDate)) {
                    setCurrentDate(startDate);
                } else if (Datetime.of(newDate).isAfter(endDate)) {
                    setCurrentDate(endDate);
                } else {
                    setCurrentDate(newDate);
                }
            }else {
                setCurrentDate(newDate);
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
                date={Datetime.of(currentDate as Date).toDate()}
                style={{height: height ? `${height}px` : 'auto', ...styles}}
                min={startDate ? Datetime.of(startDate).toDate() : Datetime.timeToCurrentDate(startDayTime ?? [7, 0]).toDate()}
                max={endDate ? Datetime.of(endDate).toDate() : Datetime.timeToCurrentDate(endDayTime ?? [19, 0]).toDate()}
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