import {useFetch} from "../useFetch.ts";
import {
    createReprimand, getAllStudentReprimandedByTeacher, getStudentReprimands, getSomeStudentReprimandedByTeacher,
    ReprimandFilterProps, getAllStudentReprimands, getClasseReprimands
} from "@/data/repository/reprimandRepository.ts";
import {Pageable, RepoOptions} from "@/core/utils/interfaces.ts";
import {useInsert} from "@/hooks/usePost.ts";
import {reprimandSchema} from "@/schema/models/reprimandSchema.ts";

export const useReprimandRepo = () => {
    const useInsertReprimand = () => useInsert(reprimandSchema, createReprimand, {
        mutationKey: ['reprimand-post']
    })

    const useGetAllStudentReprimand = (studentId: string, options?: RepoOptions) =>{
        const {data, refetch} = useFetch(['student-reprimands', studentId], getAllStudentReprimands, [studentId], !!studentId)

        if (options?.shouldRefetch)
            refetch().then()

        return data;
    }

    const useGetStudentReprimands = (studentId: string) => {
        return {
            fetchReprimands: (filter: ReprimandFilterProps, page: number, size: number, sortField?: string, sortOrder?: string) => {
                return getStudentReprimands(studentId, filter, page, size, sortField, sortOrder)
            }
        }
    }

    const useGetClasseReprimand = (classeId: number) => {
        return {
            fetchReprimands: (filter: ReprimandFilterProps, page: number, size: number, sortField?: string, sortOrder?: string) => {
                return getClasseReprimands(classeId, filter, page, size, sortField, sortOrder)
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
        useInsertReprimand,
        useGetAllStudentReprimand,
        useGetClasseReprimand,
        useGetStudentReprimands,
        useGetSomeStudentReprimandByTeacher,
        useGetAllStudentReprimandByTeacher,
    }
}