import {AssignmentView} from "../../common/AssignmentView.tsx";
import {useAssignmentRepo} from "../../../hooks/useAssignmentRepo.ts";
import {InfoPageProps} from "../../../core/utils/interfaces.ts";
import {Course} from "../../../entity";
import {useScoreRepo} from "../../../hooks/useScoreRepo.ts";

export const CourseExam = ({infoData, academicYear}: InfoPageProps<Course>) => {
    const {useGetAllCourseAssignments} = useAssignmentRepo()
    const {useGetCourseBestStudents} = useScoreRepo()

    const assignments = useGetAllCourseAssignments(infoData?.id as number, academicYear as string)
    const scoredData = useGetCourseBestStudents(infoData?.id as number, academicYear as string)

    return(
        <AssignmentView
            assignExams={assignments}
            bestScores={scoredData}
        />
    )
}