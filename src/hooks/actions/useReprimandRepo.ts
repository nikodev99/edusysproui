import {useFetch} from "../useFetch.ts";
import {
    createReprimand, getAllStudentReprimandedByTeacher, getStudentReprimands, getSomeStudentReprimandedByTeacher,
    getAllStudentReprimands, getClasseReprimands
} from "@/data/repository/reprimandRepository.ts";
import {RepoOptions} from "@/core/utils/interfaces.ts";
import {useInsert} from "@/hooks/usePost.ts";
import {reprimandSchema} from "@/schema/models/reprimandSchema.ts";
import {ReprimandFilterProps} from "@/entity/domain/reprimand.ts";
import {useGlobalStore} from "@/core/global/store.ts";

export const useReprimandRepo = () => {
    const schoolId =  useGlobalStore(state => state.schoolId)

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

    const useGetSomeStudentReprimandByTeacher = (teacherId: number) => {
        const {data} = useFetch(
            ['some-student-reprimands', teacherId,],
            getSomeStudentReprimandedByTeacher,
            [teacherId, schoolId],
            !!teacherId
        )
        return data
    }

    const useGetAllStudentReprimandByTeacher = (teacherId: number) => {
        return {
            fetchReprimands: (filters: ReprimandFilterProps, page: number, size: number, sortField?: string, sortOrder?: string) => {
                return getAllStudentReprimandedByTeacher(teacherId, filters, {page: page, size: size}, sortField, sortOrder)
            }
        }
    }

    return {
        useInsertReprimand,
        useGetAllStudentReprimand,
        useGetClasseReprimand,
        useGetStudentReprimands,
        useGetSomeStudentReprimandByTeacher,
        useGetAllStudentReprimandByTeacher,
    }
}