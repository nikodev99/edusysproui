import {InfoPageProps} from "@/core/utils/interfaces.ts";
import {Classe} from "@/entity";
import {ClasseExamView} from "./ClasseExamView.tsx";
import {useAssignmentRepo} from "@/hooks/actions/useAssignmentRepo.ts";
import {useScoreRepo} from "@/hooks/actions/useScoreRepo.ts";
import {AssignmentView} from "@/components/common/AssignmentView.tsx";
import {useState} from "react";

export const ClasseExams = ({infoData, academicYear}: InfoPageProps<Classe>) => {
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
               bestScores={scoredData}
               tabViews={[{
                   key: 'exam-list',
                   label: 'Examens',
                   children: <ClasseExamView
                       classeId={infoData?.id}
                       academicYear={academicYear || '0'}
                   />
               }]}
               name={infoData?.name}
               hasLegend={false}
               showBarChart
               getSubject={setSubject}
           />
        </>
    )
}