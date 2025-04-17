import PageWrapper from "../../view/PageWrapper.tsx";
import {ScheduleCalendar} from "../../common/ScheduleCalendar.tsx";
import {InfoPageProps} from "../../../core/utils/interfaces.ts";
import {Course, Schedule} from "../../../entity";
import {useScheduleRepo} from "../../../hooks/useScheduleRepo.ts";
import {useEffect, useState} from "react";

export const CourseSchedule = ({infoData}: InfoPageProps<Course>) => {
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const {useGetAllCourseSchedule} = useScheduleRepo()
    
    const {data, isSuccess, isLoading} = useGetAllCourseSchedule(infoData?.id as number, false)

    useEffect(() => {
        if (isSuccess)
            setSchedules(data as Schedule[])
    }, [data, isSuccess]);

    return(
        <PageWrapper>
            <ScheduleCalendar
                isLoading={isLoading}
                eventSchedule={schedules}
                hasTeacher
                eventTitle={e => `${e?.classe?.name} - ${e?.course?.course}`}
            />
        </PageWrapper>
    )
}