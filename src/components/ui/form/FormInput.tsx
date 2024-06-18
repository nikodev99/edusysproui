import {Controller} from "react-hook-form";
import {Form, Input} from "antd";
import {ZodControl} from "../../../utils/interfaces.ts";
import {CSSProperties} from "react";

interface InputProps extends ZodControl {
    defaultValue?: string,
    style?: CSSProperties
}

const FormInput = ({control,defaultValue, name, label, validateStatus, help, style}:InputProps) => {
    return(
        <Form.Item
            style={style}
            label={label} required tooltip='requis'
            validateStatus={validateStatus}
            help={help}
        >
            <Controller name={name} defaultValue={defaultValue} control={control} render={({field}) => (
                <Input {...field} />
            )} />
        </Form.Item>
    )
}

export default FormInput