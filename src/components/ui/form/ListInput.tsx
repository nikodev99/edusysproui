import {Button, Form, FormListFieldData, Input} from "antd";
import {LuMinusCircle, LuPlus, LuSave} from "react-icons/lu";
import {Controller, FieldValues, Path} from "react-hook-form";
import {InputType, TypedInputType, ZodListControl} from "../../../utils/interfaces.ts";
import Grid from "../layout/Grid.tsx";
import {cloneElement, ReactElement} from "react";

type InputListProps<T extends FieldValues> = ZodListControl<T> & InputType<T>

export const ListTextInput = <T extends FieldValues>(listProps: InputListProps<T>) => {

    const {listName, label, control, defaultValue, isCompact, buttonLabel, wrapper, onFinish} = listProps

    const pluralLabel = (inputArray: FormListFieldData[]) => {
        if (inputArray.length > 1) {
            return label?.split(' ').map(w => w + 's').join(' ')
        }
        return label
    }

    console.log('Initial Value: ', defaultValue)

    const content = (
        <Form.List name={listName as string} initialValue={defaultValue}>
            {(fields, {add, remove}) => (
                <>
                    <Form.Item>
                        <Button type='dashed' onClick={() => add()} icon={<LuPlus />}>{label}</Button>
                    </Form.Item>
                    {fields.map(({key, name}) => (
                        <Form.Item key={key} label={`${pluralLabel(fields)} ${fields.length > 1 ? key + 1: ''}`}>
                            <Controller defaultValue={defaultValue ? defaultValue[name] : ''} name={`${listProps.name}.${name}` as Path<T>} control={control} render={({field}) => (
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

    const formList = (
        isCompact ? <Form layout='vertical' onFinish={onFinish}>
            {content}
            <Form.Item>
                <Button htmlType='submit'>{buttonLabel ?? <LuSave />}</Button>
            </Form.Item>
        </Form> : content
    )

    return wrapper ? cloneElement(wrapper as ReactElement, {}, formList) : formList
}

const ListInput = <T extends FieldValues>(inputProps :TypedInputType<T>) => {
    const { hasForm, xs, md, lg, onFinish, inputType} = inputProps

    return(
        <Grid xs={xs ?? 24} md={md ?? 12} lg={lg ?? 8}>
            {hasForm ? (
                    <Form layout="vertical" onFinish={onFinish}>
                        <ListTextInput {...inputProps} isCompact={hasForm} inputType={inputType} />
                    </Form>
                ) :
                (
                    <ListTextInput {...inputProps} inputType={inputType} />
                )
            }
        </Grid>
    )
}

export default ListInput