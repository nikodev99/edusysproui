import {Controller, FieldValues} from "react-hook-form";
import {Control, ZodControl, ZodControlRender} from "../../../utils/interfaces.ts";

type FormControlProps<T extends  FieldValues> = ZodControl<T> & Control<T> & ZodControlRender<T>

const FormControl = <T extends FieldValues>({name, defaultValue, control, render}: FormControlProps<T>) => {
    return(
            <Controller name={name} defaultValue={defaultValue} control={control} render={render} />
    )
}

export default FormControl;