import {Grade} from "../../entity";
import {useFetch} from "../useFetch.ts";
import {
    getAllSchoolGrades,
    getGradeById,
    getGradesWithPlanning,
    saveGrade
} from "../../data/repository/gradeRepository.ts";
import {useInsert} from "../usePost.ts";
import {gradeSchema} from "../../schema";
import {Options, RepoOptions} from "../../core/utils/interfaces.ts";
import {useMemo} from "react";
import {SectionType} from "../../entity/enums/section.ts";
import {useGlobalStore} from "../../core/global/store.ts";

export const useGradeRepo = () => {
    const schoolId = useGlobalStore(state => state.schoolId)

    const useInsertGrade = () =>
        useInsert(gradeSchema, saveGrade)

    const useGetAllGrades = (options?: RepoOptions) => {
        const enabled = useMemo(() => !!schoolId && (options?.enable !== undefined ? options?.enable : true), [options?.enable])
        const {data} = useFetch(
            ['grades-list', schoolId],
            getAllSchoolGrades,
            [schoolId,],
            enabled
        )
        return data as Grade[] || []
    }

    const useGetAllGradesWithPlannings = (academicYearId: string, options?: RepoOptions) => {
        const shouldEnable = useMemo(() => options && 'enable' in options
            ? !!schoolId && !!academicYearId && !!options.enable
            : !!schoolId && !!academicYearId,
        [academicYearId, options])

        const {data} = useFetch(
            ['grades', academicYearId],
            getGradesWithPlanning,
            [schoolId, academicYearId],
            shouldEnable
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

    const allGrades = useGetAllGrades()

    const gradeOptions: Options = useMemo(() => allGrades ? allGrades?.map(g => ({
        value: g.id,
        label: SectionType[g.section as unknown as keyof typeof SectionType],
    })) : [], [allGrades])

    return {
        useInsertGrade,
        useGetAllGrades,
        useGetAllGradesWithPlannings,
        useGetGrade,
        allGrades,
        gradeOptions,
    }
}