import {InfoPageProps} from "../../../core/utils/interfaces.ts";
import {Classe, Schedule} from "../../../entity";
import {getAllClasseSchedule} from "../../../data/repository/scheduleRepository.tsx";
import {ScheduleCalendar} from "../../common/ScheduleCalendar.tsx";
import {AxiosResponse} from "axios";
import PageWrapper from "../../view/PageWrapper.tsx";

export const ClasseSchedule = ({infoData}: InfoPageProps<Classe>) => {
    return(
        <PageWrapper>
            <ScheduleCalendar
                fetchFunc={getAllClasseSchedule as (...args: unknown[]) =>  Promise<AxiosResponse<Schedule>>}
                funcParams={[infoData?.id]}
            />
        </PageWrapper>
    )
}