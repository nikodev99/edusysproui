import {useEffect, useMemo, useState} from "react";
import {useAcademicYearRepo} from "./useAcademicYearRepo.ts";
import Datetime from "../core/datetime.ts";

export const useAcademicYear = (timestamp?: number) => {
    const [usedAcademicYearId, setUsedAcademicYearId] = useState<string | null>(null)
    const {useGetCurrentAcademicYear, useGetAllAcademicYear, useGetAcademicYearFromYear} = useAcademicYearRepo()
    const currentAcademicYear = useGetCurrentAcademicYear()

    const year = useMemo(() => {
        return timestamp ? Datetime.of(timestamp).YEAR : undefined
    }, [timestamp])

    const allAcademicYears = useGetAllAcademicYear({enable: !timestamp})
    const yearAcademicYears = useGetAcademicYearFromYear(year as number, {enable: Boolean(timestamp && year)})

    const academicYears = timestamp ? yearAcademicYears : allAcademicYears

    const academicYearOptions = academicYears?.map(a => ({
        value: a.id,
        label: a.academicYear
    }))

    useEffect(() => {
        setUsedAcademicYearId(currentAcademicYear?.id as string)
    }, [currentAcademicYear?.id]);

    const handleAcademicYearIdValue = (value: string) =>  {
        setUsedAcademicYearId(value)
    }

    return {
        academicYears,
        usedAcademicYearId,
        currentAcademicYear,
        academicYearOptions,
        handleAcademicYearIdValue,
    }

}