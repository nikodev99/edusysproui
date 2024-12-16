import {Calendar, CalendarProps, dayjsLocalizer, View, ViewsProps} from 'react-big-calendar'
import dayjs from 'dayjs'
import {Skeleton} from "antd";
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {timeToCurrentDatetime} from "../../utils/utils.ts";
import 'dayjs/locale/fr'
import {calendarMessages} from "../../utils/text_display.ts";
import {CSSProperties, useState} from "react";

dayjs.locale('fr')
const localized = dayjsLocalizer(dayjs)

interface BigCalendarProps<TEvents extends object> {
    data: CalendarProps['events']
    views: ViewsProps<TEvents>
    defaultView: View
    startDayTime?: number[]
    endDayTime?: [number, number]
    className?: string
    styles?: CSSProperties
}

export const BigCalendar = <T extends object>({
    data, views, defaultView, startDayTime, endDayTime, className, styles
}: BigCalendarProps<T>) => {

    const [view, setView] = useState<View>(defaultView)

    const handleOnChangeView = (selectedView: View) => {
        setView(selectedView)
    }

    return (
        <div>
        {
            data === undefined ? <Skeleton active={true} loading={true}/> :
                <Calendar
                    localizer={localized}
                    events={data}
                    startAccessor="start"
                    endAccessor="end"
                    views={views}
                    view={view}
                    style={{height: 'auto', ...styles}}
                    min={timeToCurrentDatetime(startDayTime ?? [7, 0]) as Date}
                    max={timeToCurrentDatetime(endDayTime ?? [17, 0]) as Date}
                    messages={calendarMessages}
                    onView={handleOnChangeView}
                    className={className}
                />
        }
        </div>
    )
}