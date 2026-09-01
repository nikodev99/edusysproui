import {InfoPageProps} from "@/core/utils/interfaces.ts";
import {Classe} from "@/entity";
import {ClasseExamView} from "./ClasseExamView.tsx";
import {useAssignmentRepo} from "@/hooks/actions/useAssignmentRepo.ts";
import {useScoreRepo} from "@/hooks/actions/useScoreRepo.ts";
import {AssignmentView} from "@/components/common/AssignmentView.tsx";
import {useState} from "react";
import {PermissionType} from "@/pages/classe_subject/ClasseViewPage.tsx";

export const ClasseExams = ({infoData, academicYear, resourceYear, hasPermission}: InfoPageProps<Classe, PermissionType>) => {
    const {id} = infoData
    const [subject, setSubject] = useState<number | undefined>(undefined)
    const {useGetAllClasseAssignments} = useAssignmentRepo()
    const {useGetClasseBestStudents} = useScoreRepo()

    const assignments = useGetAllClasseAssignments(id, academicYear as string, subject)
    const scoredData = useGetClasseBestStudents(id, academicYear as string, subject)

    return (
        <>
           <AssignmentView
               assignExams={assignments}
               scoreStats={scoredData}
               tabViews={[{
                   key: 'exam-list',
                   label: 'Examens',
                   children: <ClasseExamView
                       classe={{classeId: infoData?.id, maxScale: infoData?.grade?.gradingScaleMax}}
                       academicYear={academicYear || '0'}
                       hasPermission={(hasPermission as PermissionType).canViewAssignment}
                   />
               }]}
               name={infoData?.name}
               hasLegend={false}
               hasPermission={(hasPermission as PermissionType).canViewStudent}
               calendarLimit={{
                   startDate: resourceYear?.startDate,
                   endDate: resourceYear?.endDate
               }}
               showBarChart
               getSubject={setSubject}
               showOnlyBestTable
           />
        </>
    )
}