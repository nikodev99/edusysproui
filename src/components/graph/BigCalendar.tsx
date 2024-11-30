import {Calendar, CalendarProps, dayjsLocalizer, View, ViewsProps} from 'react-big-calendar'
import dayjs from 'dayjs'
import {Skeleton} from "antd";
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {timeToCurrentDatetime} from "../../utils/utils.ts";
import 'dayjs/locale/fr'
import {calendarMessages} from "../../utils/text_display.ts";
import {useState} from "react";

dayjs.locale('fr')
const localized = dayjsLocalizer(dayjs)

interface BigCalendarProps<TEvents extends object> {
    data?: CalendarProps['events']
    views: ViewsProps<TEvents>
    defaultView: View
}

export const BigCalendar = <T extends object>({data, views, defaultView}: BigCalendarProps<T>) => {

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
                    style={{height: 'auto'}}
                    min={timeToCurrentDatetime([7, 0]) as Date}
                    max={timeToCurrentDatetime([17, 0]) as Date}
                    messages={calendarMessages}
                    onView={handleOnChangeView}
                />
        }
        </div>
    )
}