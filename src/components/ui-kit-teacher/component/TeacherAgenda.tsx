import {InfoPageProps} from "@/core/utils/interfaces.ts";
import {Teacher} from "@/entity";
import {getTeacherSchedule} from "@/data/repository/teacherRepository.ts";
import {ScheduleCalendar} from "@/components/common/ScheduleCalendar.tsx";

export const TeacherAgenda = ({infoData, academicYear}: InfoPageProps<Teacher>) => {
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