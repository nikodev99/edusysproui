import {InfoPageProps} from "../../../core/utils/interfaces.ts";
import {Classe, Schedule} from "../../../entity";
import {getAllClasseSchedule} from "../../../data/repository/scheduleRepositoey.tsx";
import {ScheduleCalendar} from "../../common/ScheduleCalendar.tsx";
import {AxiosResponse} from "axios";

export const ClasseSchedule = ({infoData}: InfoPageProps<Classe>) => {
    return(
        <ScheduleCalendar
            fetchFunc={getAllClasseSchedule as (...args: unknown[]) =>  Promise<AxiosResponse<Schedule>>}
            funcParams={[infoData?.id]}
        />
    )
}