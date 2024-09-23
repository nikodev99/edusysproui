import {Button, Form, FormListFieldData, Input} from "antd";
import {LuMinusCircle, LuPlus} from "react-icons/lu";
import {Controller, FieldValues} from "react-hook-form";
import {Control, ZodListControl} from "../../../utils/interfaces.ts";

type InputListProps<T extends FieldValues> = ZodListControl<T> & Control<T>

const ListInput = <T extends FieldValues>({name, label, control, zodProps}: InputListProps<T>) => {

    const pluralLabel = (inputArray: FormListFieldData[]) => {
        if (inputArray.length > 1) {
            return label.split(' ').map(w => w + 's').join(' ')
        }
        return label
    }

    return(
        <Form.List name={name}>
            {(fields, {add, remove}) => (
                <>
                    <Form.Item>
                        <Button type='dashed' onClick={() => add()} icon={<LuPlus />}>{label}</Button>
                    </Form.Item>
                    {fields.map(({key, name}) => (
                        <Form.Item key={key} label={`${pluralLabel(fields)} ${fields.length > 1 ? key + 1: ''}`}>
                            <Controller name={`${zodProps.name}.${name}` as 'academicYear'} control={control} render={({field}) => (
                                    <Input style={{width: '80%'}} {...field} />
                            )} />
                            {fields.length >= 1 ? (
                                <LuMinusCircle className='dynamic_delete_button' onClick={() => remove(name)} />
                            ) : null}
                        </Form.Item>
                    ))}
                </>
            )}
        </Form.List>
    )
}

export default ListInput