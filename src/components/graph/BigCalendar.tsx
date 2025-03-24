import {Calendar, dayjsLocalizer, View, Event} from 'react-big-calendar'
import dayjs from 'dayjs'
import {Skeleton} from "antd";
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {timeToCurrentDatetime} from "../../utils/utils.ts";
import 'dayjs/locale/fr'
import {calendarMessages} from "../../utils/text_display.ts";
import {useState} from "react";
import {BigCalendarProps} from "../../utils/interfaces.ts";

dayjs.locale('fr')
const localized = dayjsLocalizer(dayjs)

export const BigCalendar = <T extends object = Event>({
    data, views, defaultView, startDayTime, endDayTime, className, styles, onSelectEvent, start, end, showNavButton, height
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
                />
        }
        </div>
    )
}