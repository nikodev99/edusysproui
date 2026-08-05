import {InfoPageProps} from "@/core/utils/interfaces.ts";
import {Classe, Schedule} from "@/entity";
import {getAllClasseSchedule} from "@/data/repository/scheduleRepository.tsx";
import {ScheduleCalendar} from "@/components/ui-kit-schedule";
import {AxiosResponse} from "axios";
import PageWrapper from "@/components/view/PageWrapper.tsx";

export const ClasseSchedule = ({infoData, academicYear}: InfoPageProps<Classe>) => {
    return(
        <PageWrapper>
            <ScheduleCalendar
                fetchFunc={getAllClasseSchedule as (...args: unknown[]) =>  Promise<AxiosResponse<Schedule>>}
                funcParams={[infoData?.id, academicYear]}
                hasTeacher
            />
        </PageWrapper>
    )
}