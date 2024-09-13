import {Form} from "antd";
import {FormItemType} from "../../../utils/interfaces.ts";
import FormControl from "./FormControl.tsx";
import {FieldValues} from "react-hook-form";

const FormItem = <T extends FieldValues>({
   control, style, label, required, validateStatus, help, name, defaultValue, render
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
            <FormControl control={control} name={name} defaultValue={defaultValue} render={render} />
        </Form.Item>
    )
}

export default FormItem