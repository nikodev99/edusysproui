import {useCallback, useMemo} from "react";
import {useFetch} from "./useFetch.ts";
import {
    getAcademicYearFromDate,
    getAcademicYearFromYear,
    getAllAcademicYears,
    getCurrentAcademicYear, saveAcademicYear
} from "../data/repository/academicYearRepository.ts";
import {loggedUser} from "../auth/jwt/LoggedUser.ts";
import {useInsert} from "./usePost.ts";
import {academicYearSchema} from "../schema";
import {Option, RepoOptions} from "../core/utils/interfaces.ts";
import {AcademicYear} from "../entity";

export const useAcademicYearRepo = () => {
    const userSchool = useMemo(() => loggedUser.getSchool(), [])

    const useInsertAcademicYear = () =>
        useInsert(academicYearSchema, saveAcademicYear)

    const useGetCurrentAcademicYear = (shouldRefetch: boolean = false) => {
        const {data, refetch} = useFetch(['current-academic-year', userSchool?.id], getCurrentAcademicYear, [userSchool?.id], !!userSchool?.id)
        if (shouldRefetch) {
            refetch().then(r => r.data)
        }
        return data
    }
    
    const useGetAcademicYearFromYear = (year: number, options?: RepoOptions) => {
        const fetch = useFetch(
            ['academicYear-by-year', userSchool?.id, year],
            getAcademicYearFromYear,
            [userSchool?.id, year],
            options?.enable ? options?.enable && !!userSchool?.id : !!userSchool?.id
        )
        
        return fetch.data
    }

    const useGetAcademicYearFromDate = (date: Date, options?: RepoOptions) => {
        const fetch = useFetch(
            ['academicYear-by-date', userSchool?.id, date],
            getAcademicYearFromDate,
            [userSchool?.id, date],
            options?.enable ? options?.enable && !!userSchool?.id : !!userSchool?.id,
        )

        return fetch.data
    }

    const useGetAllAcademicYear = (options?: RepoOptions): AcademicYear[] => {
        const {data, refetch} = useFetch(
            ['academic-year-list', userSchool?.id],
            getAllAcademicYears,
            [userSchool?.id],
            options?.enable ? options?.enable && !!userSchool?.id : !!userSchool?.id,
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