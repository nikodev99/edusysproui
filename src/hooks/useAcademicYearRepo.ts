import {useEffect, useMemo, useState} from "react";
import {AcademicYear} from "../entity";
import {useFetch, useRawFetch} from "./useFetch.ts";
import {
    getAcademicYearFromDate,
    getAcademicYearFromYear,
    getAllAcademicYears,
    getCurrentAcademicYear, saveAcademicYear
} from "../data/repository/academicYearRepository.ts";
import {loggedUser} from "../auth/jwt/LoggedUser.ts";
import {useInsert} from "./usePost.ts";
import {academicYearSchema} from "../schema";

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
    
    const useGetAcademicYearFromYear = (year: number) => {
        const [academicYearFromYear, setAcademicYearFromYear] = useState<AcademicYear[]>([])
        const fetch = useRawFetch()
        
        useEffect(() => {
            if (year)
                fetch(getAcademicYearFromYear, [userSchool?.id, year])
                    .then(resp => {
                        if (resp) {
                            setAcademicYearFromYear(resp.data as AcademicYear[])
                        }
                    })
        }, [fetch, year]);
        
        return academicYearFromYear
    }

    const useGetAcademicYearFromDate = (date: Date) => {
        const [academicYearFromDate, setAcademicYearFromDate] = useState<AcademicYear>()
        const fetch = useRawFetch()

        useEffect(() => {
            if (date)
                fetch(getAcademicYearFromDate, [userSchool?.id, date])
                    .then(resp => {
                        if (resp) {
                            setAcademicYearFromDate(resp.data as AcademicYear)
                        }
                    })
        }, [fetch, date]);

        return academicYearFromDate
    }
    
    const useGetAllAcademicYear = (shouldRefetch: boolean = false) => {
        const {data, refetch} = useFetch(['academic-year-list', userSchool?.id], getAllAcademicYears, [userSchool?.id], !!userSchool?.id)

        if(shouldRefetch)
            refetch().then(r => r.data)

        return data
    }
    
    return {
        useInsertAcademicYear,
        useGetCurrentAcademicYear,
        useGetAcademicYearFromYear,
        useGetAcademicYearFromDate,
        useGetAllAcademicYear
    }
}