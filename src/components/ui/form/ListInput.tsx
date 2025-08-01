import {Button, Form, FormListFieldData} from "antd";
import {LuCircleMinus, LuPlus, LuSave} from "react-icons/lu";
import {FieldValues, Path} from "react-hook-form";
import {InputType, TypedInputType, ZodListControl} from "../../../core/utils/interfaces.ts";
import Grid from "../layout/Grid.tsx";
import {cloneElement, ReactElement, ReactNode} from "react";
import TextInput from "./TextInput.tsx";
import DateInput from "./DateInput.tsx";
import SelectInput from "./SelectInput.tsx";

export type FieldConfig<T extends FieldValues> = InputType<T> & {name: string}

type InputListProps<T extends FieldValues> = ZodListControl<T> & TypedInputType<T> & {
    formFields?: FieldConfig<T>[]
    isCompact?: boolean
    itemLabel?: string;
}

export const ListTextInput = <T extends FieldValues>(listProps: InputListProps<T>) => {

    const {listName, defaultValue, formFields, wrapper, isCompact, onFinish, buttonLabel, name, itemLabel = 'Item'} = listProps

    const pluralLabel = (inputArray: FormListFieldData[], baseLabel: string) => {
        if (inputArray.length > 1) {
            return baseLabel.split(' ').map(w => w + 's').join(' ');
        }
        return baseLabel;
    };

    const renderInputField = (listIndex: number, fieldConfig?: FieldConfig<T>): ReactNode => {
        const fieldPath = `${listIndex}.${name}` as Path<T>

        if (fieldConfig) {
            const longFieldPath = fieldConfig.name
                ? `${name}.${listIndex}.${fieldConfig.name}` as Path<T>
                :  fieldPath as Path<T>
            switch (fieldConfig.type) {
                case 'date':
                    return <DateInput {...fieldConfig} name={longFieldPath} xs={24} md={24} lg={24} />
                case 'number':
                    return <TextInput.Number {...fieldConfig} name={longFieldPath} xs={24} md={24} lg={24} />
                case 'select':
                    return <SelectInput {...fieldConfig} name={longFieldPath} xs={24} md={24} lg={24} />
                default:
                    return <TextInput {...fieldConfig} name={longFieldPath} xs={24} md={24} lg={24} />
            }
        }
        return <TextInput {...listProps} name={fieldPath} />
    }



    const content = (
        <Form.List name={listName as string} initialValue={defaultValue as []}>
            {(fields, {add, remove}) => (
                <>
                    <Form.Item>
                        <Button type='dashed' onClick={
                            () => formFields && formFields?.length > 0
                                ? add() : add({})
                        } icon={<LuPlus />}>{itemLabel}</Button>
                    </Form.Item>
                    {fields.map(({key, name}, index) => (
                        <div style={{
                            border: '1px solid #d9d9d9', borderRadius: '5px', padding: '5px', marginBottom: '10px', position: 'relative'
                        }} key={key}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '8px',
                            }}>
                                <h4 style={{ margin: 0, color: '#666' }}>
                                    {pluralLabel(fields, itemLabel as string)} {fields.length > 1 ? index + 1 : ''}
                                </h4>
                                {/* Only show the remove button if there are items to remove - prevents empty states */}
                                {fields.length > 0 && (
                                    <Button
                                        type="text"
                                        danger
                                        size="small"
                                        icon={<LuCircleMinus />}
                                        onClick={() => remove(name)}
                                    />
                                )}
                            </div>
                            <div style={{
                                width: '100%'
                            }}>
                                {formFields && formFields?.length > 0 ? formFields?.map((field) => (
                                    renderInputField(index, field)
                                )) : (
                                    renderInputField(index)
                                )}
                            </div>
                        </div>
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

const ListInput = <T extends FieldValues>(inputProps :TypedInputType<T> & {
    formFields?: FieldConfig<T>[],
    itemLabel?: string;
}) => {
    const { hasForm, xs, md, lg, onFinish, inputType} = inputProps

    const handleFinish = (values: unknown) => {
        console.log('Valeurs: ' + values)
        if (onFinish) {
            onFinish(values)
        }
    }

    return(
        <Grid xs={xs ?? 24} md={md ?? 12} lg={lg ?? 8}>
            <ListTextInput {...inputProps} isCompact={hasForm} inputType={inputType} onFinish={handleFinish} />
        </Grid>
    )
}

export default ListInput