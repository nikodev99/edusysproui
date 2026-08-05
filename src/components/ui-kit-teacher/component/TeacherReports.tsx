import {InfoPageProps} from "@/core/utils/interfaces.ts";
import {Teacher} from "@/entity";
import {useTeacherRepo} from "@/hooks/actions/useTeacherRepo.ts";
import {ScheduleReport} from "@/components/ui-kit-schedule";


export const TeacherReports = ({infoData, resourceYear, hasPermission, isSelf}: InfoPageProps<Teacher>) => {
    const {useGetTeacherSchedules} = useTeacherRepo()
    const {data: fetchedSchedules} = useGetTeacherSchedules(infoData?.id as string, resourceYear?.id as string)

    return(
        <ScheduleReport
            resourceYear={resourceYear}
            fetchedSchedules={fetchedSchedules}
            infoData={infoData}
            dataColumn={'id'}
            hasPermission={hasPermission}
            isSelf={isSelf}
        />
    )
}