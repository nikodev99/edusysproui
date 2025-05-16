import {useEffect, useState} from "react";
import {AcademicYear} from "../entity";
import {useRawFetch} from "./useFetch.ts";
import {
    getAcademicYearFromDate,
    getAcademicYearFromYear,
    getAllAcademicYears,
    getCurrentAcademicYear
} from "../data/repository/academicYearRepository.ts";

export const useAcademicYearRepo = () => {
    const useGetCurrentAcademicYear = () => {
        const [currentYear, setCurrentYear] = useState<AcademicYear>()
        const fetch = useRawFetch()

        useEffect(() => {
            fetch(getCurrentAcademicYear, [])
                .then(resp => {
                    if (resp) {
                        setCurrentYear(resp.data as AcademicYear)
                    }
                })
        }, [fetch]);
        
        return currentYear
    }
    
    const useGetAcademicYearFromYear = (year: number) => {
        const [academicYearFromYear, setAcademicYearFromYear] = useState<AcademicYear[]>([])
        const fetch = useRawFetch()
        
        useEffect(() => {
            if (year)
                fetch(getAcademicYearFromYear, [year])
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
                fetch(getAcademicYearFromDate, [date])
                    .then(resp => {
                        if (resp) {
                            setAcademicYearFromDate(resp.data as AcademicYear)
                        }
                    })
        }, [fetch, date]);

        return academicYearFromDate
    }
    
    const useGetAllAcademicYear = () => {
        const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
        const fetch = useRawFetch()

        useEffect(() => {
            fetch(getAllAcademicYears, [])
                .then(resp => {
                    if (resp) {
                        setAcademicYears(resp.data as AcademicYear[])
                    }
                })
        }, [fetch]);

        return academicYears
    }
    
    return {
        useGetCurrentAcademicYear,
        useGetAcademicYearFromYear,
        useGetAcademicYearFromDate,
        useGetAllAcademicYear
    }
}