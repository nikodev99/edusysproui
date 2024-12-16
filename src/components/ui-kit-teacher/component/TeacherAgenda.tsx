import {BigCalendar} from "../../graph/BigCalendar.tsx";
import {ApiEvent, InfoPageProps} from "../../../utils/interfaces.ts";
import {Schedule, Teacher} from "../../../entity";
import {useEffect, useState} from "react";
import {useRawFetch} from "../../../hooks/useFetch.ts";
import {getTeacherSchedule} from "../../../data/repository/teacherRepository.ts";
import {Day} from "../../../entity/enums/day.ts";
import {transformEvents} from "../../../utils/utils.ts";

export const TeacherAgenda = ({data}: InfoPageProps<Teacher>) => {
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const fetch = useRawFetch()

    useEffect(() => {
        fetch(getTeacherSchedule, [data.id])
            .then(resp => {
                if (resp.isSuccess) {
                    setSchedules(resp.data as Schedule[])
                }
            })
    }, [data.id, fetch]);

    console.log("Schedules ", schedules);

    const apiEvents: ApiEvent[] = schedules?.map(s => ({
        event: `${s?.classe?.name} - ${s.designation}`,
        dayOfWeek: s.dayOfWeek as Day,
        startTime: s.startTime as [number, number],
        endTime: s.endTime as [number, number],
        allDay: false
    }))

    const events = transformEvents(apiEvents)

    console.log('data in agenda: ', events)

    return(
        <BigCalendar
            data={events}
            views={['week', 'day']}
            defaultView={'week'}
            className='agenda'
        />
    )
}