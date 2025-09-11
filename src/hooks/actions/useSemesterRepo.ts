import {useFetch} from "../useFetch.ts";
import {
    getAllSemesterByAcademicYear,
    getAllSemesters,
    saveAllSemesters,
    saveSemester
} from "../../data/repository/semesterRepository.ts";
import {RepoOptions} from "../../core/utils/interfaces.ts";
import {useInsert} from "../usePost.ts";
import {allSemesterSchema, semesterSchema} from "../../schema";
import {useGlobalStore} from "../../core/global/store.ts";

export const useSemesterRepo = () => {
    const schoolId = useGlobalStore(state => state.schoolId)

    const useSaveSemester = () => useInsert(semesterSchema, saveSemester)
    const useSaveAllSemesters = () => useInsert(allSemesterSchema, saveAllSemesters)

    const useGetAllSemesters = (options?: RepoOptions) => {
        const {data, refetch} = useFetch(['semester-list', schoolId], getAllSemesters, [schoolId], !!schoolId)
        if (options?.shouldRefetch)
            refetch().then(r => r.data)

        return data
    }

    const useGetCurrentSemesters = (academicYearId: string, options?: RepoOptions) => {
        const {data, refetch} = useFetch(
            ['semester-current-list', academicYearId],
            getAllSemesterByAcademicYear,
            [academicYearId],
            !!academicYearId
        )

        if (options?.shouldRefetch)
            refetch().then(r => r.data)

        return data
    }

    return {
        useSaveAllSemesters,
        useSaveSemester,
        useGetAllSemesters,
        useGetCurrentSemesters,
    }
}