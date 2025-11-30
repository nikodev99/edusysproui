import {useReprimandRepo} from "../../../hooks/actions/useReprimandRepo.ts";
import {Enrollment} from "../../../entity";
import {useEffect, useMemo, useState} from "react";
import ListViewer from "../../custom/ListViewer.tsx";

interface StudentDisciplineProps {
    enrolledStudent: Enrollment
}

export const StudentDiscipline = ({enrolledStudent}: StudentDisciplineProps) => {
    const [academicYearId, setAcademicYearId] = useState<string>('')
    
    const {useGetAllStudentReprimands} = useReprimandRepo()
    
    const {academicYear, student} = useMemo(() => ({
        academicYear: enrolledStudent?.academicYear,
        student: enrolledStudent?.student,
    }), [enrolledStudent])

    useEffect(() => {
        setAcademicYearId(academicYear?.id)
    }, [academicYear?.id]);
    
    const {data: reprimands} = useGetAllStudentReprimands(student?.id as string, academicYearId)
    
    return(
        <div>Student discipline</div>
    )
}