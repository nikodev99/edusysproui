import {Grade} from "../entity";
import {useFetch} from "./useFetch.ts";
import {
    getAllSchoolGrades,
    getGradeById,
    getGradesWithPlanning,
    saveGrade
} from "../data/repository/gradeRepository.ts";
import {loggedUser} from "../auth/jwt/LoggedUser.ts";
import {useInsert} from "./usePost.ts";
import {gradeSchema} from "../schema";
import {RepoOptions} from "../core/utils/interfaces.ts";
import {useMemo} from "react";

export const useGradeRepo = () => {
    const userSchool = loggedUser.getSchool()

    const useInsertGrade = () =>
        useInsert(gradeSchema, saveGrade)

    const useGetAllGrades = (options?: RepoOptions) => {
        const enable = useMemo(() => !!userSchool?.id && (options?.enable !== undefined ? options?.enable : true), [options?.enable])
        const {data} = useFetch(
            ['grades-list', userSchool?.id],
            getAllSchoolGrades,
            [userSchool?.id,],
            enable
        )
        return data as Grade[] || []
    }

    const useGetAllGradesWithPlannings = (academicYearId: string) => {
        const {data} = useFetch(
            ['grades', academicYearId],
            getGradesWithPlanning,
            [userSchool?.id, academicYearId],
            !!userSchool?.id && !!academicYearId
        )
        return data as Grade[] || []
    }

    const useGetGrade = (gradeId: number, options?: RepoOptions) => {
        const {data, refetch} = useFetch(
            ['single-grade', gradeId],
            getGradeById,
            [gradeId],
            !!gradeId
        )

        if (options?.shouldRefetch)
            refetch().then(resp => resp.data)

        return data as Grade
    }

    return {
        useInsertGrade,
        useGetAllGrades,
        useGetAllGradesWithPlannings,
        useGetGrade
    }
}