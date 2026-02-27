import {useAcademicYearRepo} from "@/hooks/actions/useAcademicYearRepo.ts";
import {AcademicYear} from "@/entity";
import {SelectEntityProps} from "@/core/utils/interfaces.ts";
import {CustomEntitySelect} from "../custom/CustomEntitySelect.tsx";
import {CSSProperties} from "react";

type SelectAcademicYearProps = {
    getAcademicYear: (value: string | string[]) => void
    academicYears?: AcademicYear[]
    style: CSSProperties;
} & SelectEntityProps<AcademicYear, string>

export const SelectAcademicYear = (
    {getAcademicYear, academicYears, variant, onlyCurrent, placeholder, getResource, style}: SelectAcademicYearProps
) => {

    const {useGetAllAcademicYear} = useAcademicYearRepo()
    const allYears = useGetAllAcademicYear()

    const handleAcademicYearChange = (value: string | string[]) => {
        getAcademicYear && getAcademicYear(value)
    }

    return (
        <CustomEntitySelect
            style={style}
            getEntity={handleAcademicYearChange}
            data={allYears}
            entities={academicYears}
            uniqueValue={{key: 'current', value: true}}
            options={{id: 'id', label: 'academicYear'}}
            variant={variant}
            placeholder={placeholder}
            onlyCurrent={onlyCurrent}
            getResource={getResource}
        />
    )
}