import {useAcademicYearRepo} from "@/hooks/actions/useAcademicYearRepo.ts";
import {AcademicYear} from "@/entity";
import {SelectEntityProps} from "@/core/utils/interfaces.ts";
import {CustomEntitySelect} from "../custom/CustomEntitySelect.tsx";
import {CSSProperties, useMemo} from "react";
import Datetime from "@/core/datetime.ts";

type SelectAcademicYearProps = {
    getAcademicYear: (value: string | string[]) => void
    academicYears?: AcademicYear[]
    style?: CSSProperties;
} & SelectEntityProps<AcademicYear, string>

export const SelectAcademicYear = (
    {getAcademicYear, academicYears, variant, onlyCurrent, placeholder, getResource, style, onChange, when}: SelectAcademicYearProps
) => {

    const {useGetAllAcademicYear} = useAcademicYearRepo()
    const allYears = useGetAllAcademicYear({enable: academicYears === undefined})
    const wantedAcademicYears = useMemo(() => {
        const all = allYears || academicYears
        return all?.filter(a => {
            const start = Datetime.of(a.startDate)
            const end = Datetime.of(a.endDate)
            
            if (when?.after && !end.isAfter(when.after)) {
                return false
            }

            return !(when?.before && !start.isBefore(when.before));

        })
    }, [academicYears, allYears, when])

    const handleAcademicYearChange = (value: string | string[]) => {
        getAcademicYear && getAcademicYear(value)
    }

    return (
        <CustomEntitySelect
            style={style}
            getEntity={handleAcademicYearChange}
            data={wantedAcademicYears}
            uniqueValue={{key: 'current', value: true}}
            options={{id: 'id', label: 'academicYear'}}
            variant={variant}
            placeholder={placeholder}
            onlyCurrent={onlyCurrent}
            getResource={getResource}
            onChange={onChange}
        />
    )
}