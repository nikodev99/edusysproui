import {Select} from "antd";
import {useEffect, useMemo, useState} from "react";
import {useAcademicYearRepo} from "../../hooks/useAcademicYearRepo.ts";
import {AcademicYear} from "../../entity";

export const SelectAcademicYear = ({getAcademicYear, academicYears}: {
    getAcademicYear: (value: string) => void
    academicYears?: AcademicYear[],
}) => {

    const [allAcademicYears, setAllAcademicYears] = useState<AcademicYear[]>([])
    const [activeAcademicYear, setActiveAcademicYear] = useState<AcademicYear>()
    const {useGetAllAcademicYear} = useAcademicYearRepo()
    const allYears = useGetAllAcademicYear()

    useEffect(() => {
        if (academicYears && academicYears.length > 0) {
            setAllAcademicYears(academicYears)
        }else {
            setAllAcademicYears(allYears)
        }
    }, [academicYears, allYears]);

    useEffect(() => {
        if (allAcademicYears && allAcademicYears.length > 0) {
            setActiveAcademicYear(allAcademicYears?.find(a => a.current))
        }
    }, [allAcademicYears]);

    useEffect(() => {
        if (activeAcademicYear) {
            getAcademicYear(activeAcademicYear.id)
        }
    }, [activeAcademicYear, getAcademicYear]);

    const academicYearOptions = useMemo(() => {
        return allAcademicYears.map(a => ({
            value: a.id,
            label: a.academicYear
        }))
    }, [allAcademicYears]);

    const handleAcademicYearIdValue = (value: string) => {
        const selected = allAcademicYears.find(a => a.id === value);
        setActiveAcademicYear(selected); // <-- update selection
    }

    return (
        <Select
            className='select-control'
            value={activeAcademicYear?.id}
            options={academicYearOptions}
            onChange={handleAcademicYearIdValue}
            variant='borderless'
        />
    )
}