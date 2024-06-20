import {Controller} from "react-hook-form";
import {Form, Input} from "antd";
import {ZodControl} from "../../../utils/interfaces.ts";
import {CSSProperties} from "react";

interface InputProps extends ZodControl {
    defaultValue?: string,
    style?: CSSProperties
    required?: boolean,
    placeholder?: string
}

const FormInput = (inputProps :InputProps) => {
    const {
        control,
        defaultValue,
        name,
        label,
        validateStatus,
        help,
        style,
        required,
        placeholder
    } = inputProps

    return(
        <Form.Item
            style={style}
            label={label} required={required} tooltip={required ? 'requis' : undefined}
            validateStatus={validateStatus}
            help={help}
        >
            <Controller name={name} defaultValue={defaultValue} control={control} render={({field}) => (
                <Input placeholder={placeholder} {...field} />
            )} />
        </Form.Item>
    )
}

export default FormInput