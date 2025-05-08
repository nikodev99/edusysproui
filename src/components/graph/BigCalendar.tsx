import {Calendar, dayjsLocalizer, View, Event} from 'react-big-calendar'
import dayjs from 'dayjs'
import {Skeleton} from "antd";
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {timeToCurrentDatetime} from "../../core/utils/utils.ts";
import 'dayjs/locale/fr'
import {calendarMessages} from "../../core/utils/text_display.ts";
import {useState} from "react";
import {BigCalendarProps} from "../../core/utils/interfaces.ts";

dayjs.locale('fr')
const localized = dayjsLocalizer(dayjs)

export const BigCalendar = <T extends object = Event>(
    {
        data, views, defaultView, startDayTime, endDayTime,
        className, styles, onSelectEvent, start, end,
        showNavButton, height, onSelectSlot, isLoading = false, wrapperColor, selectable = false,
    }: BigCalendarProps<T>
) => {

    const [view, setView] = useState<View>(defaultView)

    const handleOnChangeView = (selectedView: View) => {
        setView(selectedView)
    }

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
                style={{height: height ? `${height}px` : 'auto', ...styles}}
                min={timeToCurrentDatetime(startDayTime ?? [7, 0]) as Date}
                max={timeToCurrentDatetime(endDayTime ?? [19, 0]) as Date}
                messages={calendarMessages}
                onView={handleOnChangeView}
                className={!showNavButton ? `big-calendar ${className}` : className}
                onSelectEvent={onSelectEvent}
                onSelectSlot={onSelectSlot}
                selectable={selectable}
                eventPropGetter={eventPropGetter}
            />
        }
        </>
    )
}