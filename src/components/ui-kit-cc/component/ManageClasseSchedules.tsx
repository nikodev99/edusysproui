import {Classe} from "@/entity";
import OutletPage from "@/pages/OutletPage.tsx";
import {DragAndDropScheduleCalendar} from "@/components/ui-kit-schedule";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {text} from "@/core/utils/text_display.ts";
import {useScheduleRepo} from "@/hooks/actions/useScheduleRepo.ts";
import {useAcademicYearRepo} from "@/hooks/actions/useAcademicYearRepo.ts";

export interface ClasseScheduleProps {
    classe?: Classe
}

export const ManageClasseSchedules = ({classe}: ClasseScheduleProps) => {
    const {toClasseAndCourse, toViewClasse} = useRedirect()
    const {currentAcademicYear} = useAcademicYearRepo()
    const {useGetAllClasseSchedule} = useScheduleRepo()

    const {data: schedules, refetch} = useGetAllClasseSchedule(classe?.id as number, currentAcademicYear?.id as string)

    return(
        <OutletPage
            metadata={{title: "Gestion d'emploi du temps", description: "Gestion d'emploi du temps"}}
            breadCrumb={{bCItems: [
                {title: text.cc.label, setRedirect: toClasseAndCourse},
                {title: classe?.name, setRedirect: () => toViewClasse(classe?.id as number)},
                {title: "Gestion d'emploi du temps"}
            ]}}
        >
            <DragAndDropScheduleCalendar
                schedules={schedules}
                classe={classe}
                academicYear={currentAcademicYear?.id}
                setRefresh={refetch}
            />
        </OutletPage>
    )
}