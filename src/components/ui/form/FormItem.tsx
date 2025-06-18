import {Form} from "antd";
import {FormItemType} from "../../../core/utils/interfaces.ts";
import FormControl from "./FormControl.tsx";
import {FieldValues} from "react-hook-form";

const FormItem = <T extends FieldValues>({
   control, style, label, required, validateStatus, help, name, defaultValue, render, key
}: FormItemType<T>) => {
    return(
        <Form.Item
            style={style}
            label={label}
            required={required}
            tooltip={required ? 'requis' : undefined}
            validateStatus={validateStatus}
            help={help}
        >
            <FormControl key={key} control={control} name={name} defaultValue={defaultValue} render={render} />
        </Form.Item>
    )
}

export default FormItem