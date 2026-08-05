import {InfoPageProps} from "@/core/utils/interfaces.ts";
import {Classe} from "@/entity";
import {useScheduleRepo} from "@/hooks/actions/useScheduleRepo.ts";
import {ScheduleReport} from "@/components/ui-kit-schedule";
import {useMemo} from "react";

const ClasseReport = ({infoData, resourceYear, hasPermission, isSelf, academicYear}: InfoPageProps<Classe>) => {
    const {useGetAllClasseSchedule} = useScheduleRepo()
    const {data} = useGetAllClasseSchedule(infoData?.id, academicYear as string)
    const fetchedData = useMemo(() => data?.filter(s => s?.teacher?.personalInfo?.id !== 0), [data])

    return(
        <ScheduleReport
            resourceYear={resourceYear}
            fetchedSchedules={fetchedData}
            infoData={infoData}
            dataColumn={'id'}
            hasPermission={hasPermission}
            isSelf={isSelf}
            isClasse
        />
    )
}

export { ClasseReport }