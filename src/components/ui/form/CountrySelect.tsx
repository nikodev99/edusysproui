import {FieldValues} from "react-hook-form";
import {getCountryListInFrench} from "../../../utils/utils.ts";
import {TypedInputType} from "../../../utils/interfaces.ts";
import {useMemo} from "react";
import SelectInput from "./SelectInput.tsx";

const CountrySelect = <T extends FieldValues>(countryOptionsProps: TypedInputType<T>) => {

    const countryOptions = useMemo(() => getCountryListInFrench(), [])
    const filterOption = (input: string, option?: { label: string; value: string }) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const {defaultValue} = countryOptionsProps

    return(
        <SelectInput
            {...countryOptionsProps}
            defaultValue={defaultValue}
            options={countryOptions}
            filterOption={filterOption}
            placeholder='Sélectionner le pays'
        />
    )
}

export default CountrySelect