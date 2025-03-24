import {InfoPageProps} from "../../../utils/interfaces.ts";
import {Schedule, Teacher} from "../../../entity";
import {getTeacherSchedule} from "../../../data/repository/teacherRepository.ts";
import {ScheduleCalendar} from "../../common/ScheduleCalendar.tsx";
import {AxiosResponse} from "axios";

export const TeacherAgenda = ({infoData}: InfoPageProps<Teacher>) => {
    return(
        <ScheduleCalendar
            fetchFunc={getTeacherSchedule as (...args: unknown[]) =>  Promise<AxiosResponse<Schedule>>}
            funcParams={[infoData?.id]}
            eventTitle={s => `${s?.classe?.name} - ${s.designation}`}
            showClass={true}
            showTeacher={false}
        />
    )
}