import {useFetch} from "../useFetch.ts";
import {
    getAllStudentReprimandedByTeacher,
    getAllStudentReprimands,
    getSomeStudentReprimandedByTeacher, ReprimandFilterProps
} from "../../data/repository/reprimandRepository.ts";
import {Pageable} from "../../core/utils/interfaces.ts";

export const useReprimandRepo = () => {
    const useGetAllStudentReprimands = (studentId: string) => {
        return {
            fetchReprimands: (filter: ReprimandFilterProps, page: number, size: number, sortField?: string, sortOrder?: string) => {
                return getAllStudentReprimands(studentId, filter, page, size, sortField, sortOrder)
            }
        }
    }

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