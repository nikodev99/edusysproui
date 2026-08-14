import {AssignmentView} from "@/components/common/AssignmentView.tsx";
import {useAssignmentRepo} from "@/hooks/actions/useAssignmentRepo.ts";
import {InfoPageProps} from "@/core/utils/interfaces.ts";
import {Course} from "@/entity";
import {useScoreRepo} from "@/hooks/actions/useScoreRepo.ts";
import {PermissionType} from "@/pages/classe_subject/ClasseViewPage.tsx";

export const CourseExam = ({infoData, academicYear, resourceYear, hasPermission}: InfoPageProps<Course, PermissionType>) => {
    const {useGetAllCourseAssignments} = useAssignmentRepo()
    const {useGetCourseBestStudents} = useScoreRepo()

    const assignments = useGetAllCourseAssignments(infoData?.id as number, academicYear as string)
    const scoredData = useGetCourseBestStudents(infoData?.id as number, academicYear as string)

    return(
        <AssignmentView
            assignExams={assignments}
            scoreStats={scoredData}
            calendarLimit={{
                startDate: resourceYear?.startDate,
                endDate: resourceYear?.endDate
            }}
            name={infoData?.course}
            showOnlyBestTable
            hasPermission={(hasPermission as PermissionType).canViewStudent}
        />
    )
}