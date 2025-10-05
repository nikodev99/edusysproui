import {useCallback} from "react";
import {useFetch} from "../useFetch.ts";
import {
    getAcademicYearFromDate,
    getAcademicYearFromYear,
    getAllAcademicYears,
    getCurrentAcademicYear, saveAcademicYear
} from "../../data/repository/academicYearRepository.ts";
import {useInsert} from "../usePost.ts";
import {academicYearSchema} from "../../schema";
import {Option, RepoOptions} from "../../core/utils/interfaces.ts";
import {AcademicYear} from "../../entity";
import {useGlobalStore} from "../../core/global/store.ts";

export const useAcademicYearRepo = () => {
    const schoolId = useGlobalStore(state => state.schoolId)

    const useInsertAcademicYear = () =>
        useInsert(academicYearSchema, saveAcademicYear)

    const useGetCurrentAcademicYear = (shouldRefetch: boolean = false) => {
        const {data, refetch} = useFetch(['current-academic-year', schoolId], getCurrentAcademicYear, [schoolId], !!schoolId)
        if (shouldRefetch) {
            refetch().then(r => r.data)
        }
        return data
    }
    
    const useGetAcademicYearFromYear = (year: number, options?: RepoOptions) => {
        const fetch = useFetch(
            ['academicYear-by-year', schoolId, year],
            getAcademicYearFromYear,
            [schoolId, year],
            options?.enable ? options?.enable && !!schoolId : !!schoolId
        )
        
        return fetch.data
    }

    const useGetAcademicYearFromDate = (date: Date, options?: RepoOptions) => {
        const fetch = useFetch(
            ['academicYear-by-date', schoolId, date],
            getAcademicYearFromDate,
            [schoolId, date],
            options?.enable ? options?.enable && !!schoolId : !!schoolId,
        )

        return fetch.data
    }

    const useGetAllAcademicYear = (options?: RepoOptions): AcademicYear[] => {
        const {data, refetch} = useFetch(
            ['academic-year-list', schoolId],
            getAllAcademicYears,
            [schoolId],
            options?.enable ? options?.enable && !!schoolId : !!schoolId,
        )

        if(options?.shouldRefetch)
            refetch().then(r => r.data)

        return data || []
    }

    const allAcademicYears = useGetAllAcademicYear()
    const currentAcademicYear = useGetCurrentAcademicYear()

    const academicYearOptions = useCallback((current: boolean = false): Option[] => {
        const academicYears = current ? [currentAcademicYear] : allAcademicYears
        return academicYears?.map(a => ({
            value: a?.id,
            label: a?.academicYear
        }))
    }, [allAcademicYears, currentAcademicYear])
    
    return {
        useInsertAcademicYear,
        useGetCurrentAcademicYear,
        currentAcademicYear,
        useGetAcademicYearFromYear,
        useGetAcademicYearFromDate,
        useGetAllAcademicYear,
        allAcademicYears,
        academicYearOptions
    }
}