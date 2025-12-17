import {Filter} from "../common/Filter.tsx";
import {useMemo, useState} from "react";
import {ReprimandFilterProps} from "../../data/repository/reprimandRepository.ts";
import {FilterType, useFilter} from "../../hooks/useFilter.ts";
import {useClasseRepo} from "../../hooks/actions/useClasseRepo.ts";
import {ItemType} from "antd/es/menu/interface";
import {Options} from "../../core/utils/interfaces.ts";
import {enumToObjectArray} from "../../core/utils/utils.ts";
import {PunishmentType} from "../../entity/enums/punishmentType.ts";
import {ReprimandType} from "../../entity/enums/reprimandType.ts";
import {PunishmentStatus} from "../../entity/enums/punishmentStatus.ts";

export const ReprimandFilters = (
    {academicYear, setFilters, academicYearOptions}: FilterType<ReprimandFilterProps>
) => {
    const [filterItem, setFilterItem] = useState<ReprimandFilterProps>({
        academicYear: academicYear as string
    })
    const {useGetClasseBasicValues} = useClasseRepo()

    const fetchedClasses = useGetClasseBasicValues()

    const classes = useMemo(() => fetchedClasses ?? [], [fetchedClasses])
    const pTypes = enumToObjectArray(PunishmentType)
    const rTypes = enumToObjectArray(ReprimandType)
    const pStatus = enumToObjectArray(PunishmentStatus)
    
    const {getOptions, makeOnChange, handleUpdateFilters, handleClear} = useFilter(setFilterItem, setFilters)
    
    const options = useMemo(() => ({
        academicYear: academicYearOptions,
        classeId: getOptions(classes, 'id', 'name'),
        punishmentType: getOptions(pTypes,'label', 'value'),
        reprimandType: getOptions(rTypes, 'label', 'value'),
        punishmentStatus: getOptions(pStatus, 'label', 'value')
    })  as Record<keyof ReprimandFilterProps, Options>, [academicYearOptions, classes, getOptions, pStatus, pTypes, rTypes])
    
    const onChange = useMemo(() => ({
        classeId: makeOnChange('classeId'),
        punishmentType: makeOnChange('punishmentType'),
        reprimandType: makeOnChange('reprimandType'),
        punishmentStatus: makeOnChange('punishmentStatus')
    }) as Record<keyof ReprimandFilterProps, (value: unknown) => void>, [setFilters])

    const items: ItemType[] = [
        {key: '2', label: 'Classe', onClick: () => handleUpdateFilters('classeId')},
        {key: '3', label: 'Type de punition', onClick: () => handleUpdateFilters('punishmentType')},
        {key: '4', label: 'Type de réprimande', onClick: () => handleUpdateFilters('reprimandType')},
        {key: '5', label: 'Statut de punition', onClick: () => handleUpdateFilters('punishmentStatus')}
    ]

    return(
        <Filter
            filters={filterItem}
            items={items}
            onClear={handleClear}
            options={options}
            onChanges={onChange}
        />
    )
}