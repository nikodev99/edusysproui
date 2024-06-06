import {Controller} from "react-hook-form";
import {Form, Select} from "antd";
import {getCountyListInFrench} from "../../../utils/utils.ts";
import {ZodControl} from "../../../utils/interfaces.ts";
import {useMemo} from "react";

const CountrySelect = ({control, label, validateStatus, help, name}: ZodControl) => {

    const countryOptions = useMemo(() => getCountyListInFrench(), [])
    const filterOption = (input: string, option?: { label: string; value: string }) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return(
        <Form.Item label={label} required tooltip='requis' validateStatus={validateStatus} help={help}>
            <Controller name={name} control={control} render={({field}) => (
                <Select showSearch options={countryOptions} filterOption={filterOption} placeholder='Selection votre pays' {...field} />
            )} />
        </Form.Item>
    )
}

export default CountrySelect