import {useFetch} from "../useFetch.ts";
import {
    getAllStudentReprimandedByTeacher,
    getAllStudentReprimands,
    getSomeStudentReprimandedByTeacher
} from "../../data/repository/reprimandRepository.ts";
import {Pageable} from "../../core/utils/interfaces.ts";

export const useReprimandRepo = () => {
    const useGetAllStudentReprimands = (studentId: string, academicYear: string) => useFetch(
        ['student-reprimands', studentId, academicYear],
        getAllStudentReprimands,
        [studentId, academicYear],
        !!studentId && !!academicYear
    )

    const useGetSomeStudentReprimandByTeacher = (teacherId: string) => {
        const {data} = useFetch(['some-student-reprimands', teacherId], getSomeStudentReprimandedByTeacher, [teacherId], !!teacherId)
        return data
    }

    const useGetAllStudentReprimandByTeacher = (teacherId: number, academicYearId: string, pageable: Pageable = {page: 0, size: 10}) => useFetch(
        ['all-student-reprimands', teacherId, academicYearId],
        getAllStudentReprimandedByTeacher,
        [teacherId, academicYearId, pageable],
        !!teacherId && !!academicYearId
    )

    return {
        useGetAllStudentReprimands,
        useGetSomeStudentReprimandByTeacher,
        useGetAllStudentReprimandByTeacher,
    }
}