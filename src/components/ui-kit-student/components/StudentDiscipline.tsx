import {useReprimandRepo} from "@/hooks/actions/useReprimandRepo.ts";
import {Enrollment} from "@/entity";
import {useMemo} from "react";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {ReprimandList} from "@/components/common/ReprimandList.tsx";

interface StudentDisciplineProps {
    enrolledStudent: Enrollment
}

export const StudentDiscipline = ({enrolledStudent}: StudentDisciplineProps) => {
    const {toDiscipline} = useRedirect()
    
    const {useGetStudentReprimands} = useReprimandRepo()
    
    const {academicYear, student} = useMemo(() => ({
        academicYear: enrolledStudent?.academicYear,
        student: enrolledStudent?.student,
    }), [enrolledStudent?.academicYear, enrolledStudent?.student])

    const {fetchReprimands} = useGetStudentReprimands(student?.id as string)

    return(
        <ReprimandList
            callback={fetchReprimands as () => never}
            toDiscipline={() => toDiscipline(student?.id, enrolledStudent)}
            academicYear={academicYear?.id}
        />
    )
}