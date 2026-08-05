import {InfoPageProps} from "@/core/utils/interfaces.ts";
import {Teacher} from "@/entity";
import {getTeacherSchedule} from "@/data/repository/teacherRepository.ts";
import {ScheduleCalendar} from "@/components/ui-kit-schedule/components/ScheduleCalendar.tsx";
import {Skeleton} from "antd";

export const TeacherAgenda = ({infoData, academicYear}: InfoPageProps<Teacher>) => {
    if (!infoData || !academicYear)
        return <Skeleton active={true} paragraph={{ rows: 4 }} />

    return(
        <ScheduleCalendar
            fetchFunc={getTeacherSchedule as never}
            funcParams={[infoData?.id, academicYear]}
            eventTitle={s => `${s?.classe?.name} - ${s.designation}`}
            showClass={true}
            showTeacher={false}
            hasTeacher={true}
        />
    )
}