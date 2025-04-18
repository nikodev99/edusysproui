import {InfoPageProps} from "../../../core/utils/interfaces.ts";
import {Score, Teacher} from "../../../entity";
import {useEffect, useState} from "react";
import {useAssignmentRepo} from "../../../hooks/useAssignmentRepo.ts";
import {useScoreRepo} from "../../../hooks/useScoreRepo.ts";
import {AssignmentView} from "../../common/AssignmentView.tsx";

export const TeacherAssignments = ({infoData}: InfoPageProps<Teacher>) => {
    const {personalInfo, courses, classes} = infoData
    
    const [subjectValue, setSubjectValue] = useState<number | undefined>(courses && courses?.length > 0 ? courses[0].id as number : 0)
    const [classeValue, setClasseValue] = useState<number>(classes && classes?.length > 0 ? classes[0].id as number : 0)
    const [scores, setScores] = useState<Score[]>([])
    const {useGetAllTeacherAssignments} = useAssignmentRepo()
    const {useGetBestTeacherStudents} = useScoreRepo()
    
    const assignments = useGetAllTeacherAssignments(personalInfo?.id as bigint, {classId: classeValue, courseId: subjectValue})
    const {data, isSuccess} =  useGetBestTeacherStudents(personalInfo?.id as bigint, subjectValue)

    useEffect(() => {
        if (isSuccess)
            setScores(data as Score[])
    }, [data, isSuccess]);

    const handleClasseValue = (value: number) => {
        if (value !== classeValue) {
            setClasseValue(value)
            setTimeout(() => {
                assignments.refetch()
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
        />
    )
}