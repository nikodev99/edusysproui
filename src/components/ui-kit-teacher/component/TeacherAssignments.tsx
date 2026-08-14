import {InfoPageProps} from "@/core/utils/interfaces.ts";
import {GradeRankingStudent, Teacher} from "@/entity";
import {useEffect, useState} from "react";
import {useAssignmentRepo} from "@/hooks/actions/useAssignmentRepo.ts";
import {useScoreRepo} from "@/hooks/actions/useScoreRepo.ts";
import {AssignmentView} from "@/components/common/AssignmentView.tsx";
import {Button} from "antd";
import {useRedirect} from "@/hooks/useRedirect.ts";

export const TeacherAssignments = ({infoData, hasPermission, resourceYear, isSelf}: InfoPageProps<Teacher>) => {
    const {personalInfo} = infoData

    const classes = infoData?.classes?.map(tc => tc.classe)
    const courses = infoData?.courses?.map(tc => tc.course)
    
    const [subjectValue, setSubjectValue] = useState<number | undefined>(courses && courses?.length > 0 ? courses[0].id as number : 0)
    const [classeValue, setClasseValue] = useState<number>(classes && classes?.length > 0 ? classes[0].id as number : 0)
    const [bestStudents, setBestStudents] = useState<GradeRankingStudent[]>([])
    const {useGetAllTeacherAssignments} = useAssignmentRepo()
    const {useGetBestTeacherStudents} = useScoreRepo()
    const {toExam} = useRedirect()
    
    const assignments = useGetAllTeacherAssignments(
        personalInfo?.id as number,
        resourceYear?.id as string,
        {classId: classeValue, courseId: subjectValue}
    )
    const {data, isSuccess} =  useGetBestTeacherStudents(personalInfo?.id as number, resourceYear?.id as string, subjectValue)

    useEffect(() => {
        if (isSuccess)
            setBestStudents(data)
    }, [data, isSuccess]);

    const handleClasseValue = (value: number) => {
        if (value !== classeValue) {
            setClasseValue(value)
            setTimeout(() => {
                assignments.refetch().then(r => r)
            }, 50)
        }
    }

    return (
        <AssignmentView 
            assignExams={assignments}
            scoreStats={bestStudents}
            getSubject={setSubjectValue}
            getClasse={handleClasseValue}
            classes={classes}
            courses={courses}
            calendarLimit={{
                startDate: resourceYear?.startDate,
                endDate: resourceYear?.endDate
            }}
            {...(hasPermission && isSelf
                ? {
                    selects: [
                        <Button key="add-exam" type="primary" onClick={toExam}>
                            Ajouter un dévoir
                        </Button>,
                    ],
                }
                : {})
            }
            showOnlyBestTable
        />
    )
}