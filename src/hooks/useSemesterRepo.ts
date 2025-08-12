import {useMemo} from "react";
import {useFetch} from "./useFetch.ts";
import {
    getAllSemesterByAcademicYear,
    getAllSemesters,
    saveAllSemesters,
    saveSemester
} from "../data/repository/semesterRepository.ts";
import {loggedUser} from "../auth/jwt/LoggedUser.ts";
import {RepoOptions} from "../core/utils/interfaces.ts";
import {useInsert} from "./usePost.ts";
import {allSemesterSchema, semesterSchema} from "../schema";

export const useSemesterRepo = () => {
    const userSchool = useMemo(() => loggedUser.getSchool(), [])

    const useSaveSemester = () => useInsert(semesterSchema, saveSemester)
    const useSaveAllSemesters = () => useInsert(allSemesterSchema, saveAllSemesters)

    const useGetAllSemesters = (options?: RepoOptions) => {
        const {data, refetch} = useFetch(['semester-list', userSchool?.id], getAllSemesters, [userSchool?.id], !!userSchool?.id)
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