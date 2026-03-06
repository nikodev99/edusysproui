import {InfoPageProps} from "@/core/utils/interfaces.ts";
import {Teacher} from "@/entity";
import {getTeacherSchedule} from "@/data/repository/teacherRepository.ts";
import {ScheduleCalendar} from "@/components/common/ScheduleCalendar.tsx";

export const TeacherAgenda = ({infoData}: InfoPageProps<Teacher>) => {
    return(
        <ScheduleCalendar
            fetchFunc={getTeacherSchedule as never}
            funcParams={[infoData?.id]}
            eventTitle={s => `${s?.classe?.name} - ${s.designation}`}
            showClass={true}
            showTeacher={false}
        />
    )
}