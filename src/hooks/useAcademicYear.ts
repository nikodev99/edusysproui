import {AcademicYear} from "../entity";
import {initAcademicYears, initCurrentAcademicYear, useGlobalStore} from "../core/global/store.ts";
import {useEffect, useState} from "react";
import {datetimeExpose, isObjectEmpty} from "../core/utils/utils.ts";

export const useAcademicYear = (timestamp?: number) => {
    const currentAcademicYear: AcademicYear = useGlobalStore.use.currentAcademicYear()
    const academicYears: AcademicYear[] = useGlobalStore.use.academicYears()

    const [usedAcademicYearId, setUsedAcademicYearId] = useState<string | null>(null)
    
    
    useEffect(() => {
        if (!isObjectEmpty(currentAcademicYear))
            setUsedAcademicYearId(currentAcademicYear.id)
    }, [currentAcademicYear]);

    useEffect(() => {
        if(isObjectEmpty(currentAcademicYear)) {
            initCurrentAcademicYear()
        }
        if (academicYears.length === 0 && timestamp) {
            const date = datetimeExpose(timestamp)
            initAcademicYears(date?.year as number)
        }
    }, [academicYears.length, currentAcademicYear, timestamp])

    const academicYearOptions = academicYears?.map(a => ({
        value: a.id,
        label: a.academicYear
    }))

    const handleAcademicYearIdValue = (value: string) =>  {
        setUsedAcademicYearId(value)
    }

    return {
        usedAcademicYearId,
        currentAcademicYear,
        academicYearOptions,
        handleAcademicYearIdValue,
    }

}