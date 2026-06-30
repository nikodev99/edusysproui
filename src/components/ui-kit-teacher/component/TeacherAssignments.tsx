import {InfoPageProps} from "@/core/utils/interfaces.ts";
import {Score, Teacher} from "@/entity";
import {useEffect, useState} from "react";
import {useAssignmentRepo} from "@/hooks/actions/useAssignmentRepo.ts";
import {useScoreRepo} from "@/hooks/actions/useScoreRepo.ts";
import {AssignmentView} from "@/components/common/AssignmentView.tsx";
import {Button} from "antd";
import {useRedirect} from "@/hooks/useRedirect.ts";

export const TeacherAssignments = ({infoData, hasPermission, resourceYear}: InfoPageProps<Teacher>) => {
    const {personalInfo, courses, classes} = infoData
    
    const [subjectValue, setSubjectValue] = useState<number | undefined>(courses && courses?.length > 0 ? courses[0].id as number : 0)
    const [classeValue, setClasseValue] = useState<number>(classes && classes?.length > 0 ? classes[0].id as number : 0)
    const [scores, setScores] = useState<Score[]>([])
    const {useGetAllTeacherAssignments} = useAssignmentRepo()
    const {useGetBestTeacherStudents} = useScoreRepo()
    const {toExam} = useRedirect()
    
    const assignments = useGetAllTeacherAssignments(personalInfo?.id as number, {classId: classeValue, courseId: subjectValue})
    const {data, isSuccess} =  useGetBestTeacherStudents(personalInfo?.id as number, subjectValue)

    useEffect(() => {
        if (isSuccess)
            setScores(data as Score[])
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
            bestScores={scores}
            getSubject={setSubjectValue}
            getClasse={handleClasseValue}
            classes={classes}
            courses={courses}
            calendarLimit={{
                startDate: resourceYear?.startDate,
                endDate: resourceYear?.endDate
            }}
            {...(hasPermission
                ? {
                    selects: [
                        <Button key="add-exam" type="primary" onClick={toExam}>
                            Ajouter un dévoir
                        </Button>,
                    ],
                }
                : {})
            }
        />
    )
}