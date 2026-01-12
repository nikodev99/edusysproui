import {Button, Form} from "antd";
import {LuCircleMinus, LuPlus, LuSave} from "react-icons/lu";
import {FieldValues, Path} from "react-hook-form";
import {InputType, TypedInputType, ZodListControl} from "@/core/utils/interfaces.ts";
import Grid from "../layout/Grid.tsx";
import {cloneElement, ReactElement, ReactNode, useEffect} from "react";
import TextInput from "./TextInput.tsx";
import DateInput from "./DateInput.tsx";
import SelectInput from "./SelectInput.tsx";
import Responsive from "../layout/Responsive.tsx";
import RadioInput from "./RadioInput.tsx";

export type FieldConfig<T extends FieldValues> = InputType<T> & {name: string}

type InputListProps<T extends FieldValues> = ZodListControl<T> & TypedInputType<T> & {
    formFields?: FieldConfig<T>[]
    isCompact?: boolean
    itemLabel?: string;
}

export const ListTextInput = <T extends FieldValues>(listProps: InputListProps<T>) => {
    const {listName, defaultValue, formFields, wrapper, isCompact, onFinish, buttonLabel, name, itemLabel = 'Item', control} = listProps

    // Key fix: Set the default values in React Hook Form when the component mounts
    useEffect(() => {
        if (defaultValue && Array.isArray(defaultValue) && defaultValue.length > 0 && control) {

            // Set the values in React Hook Form
            control._subjects.state.next(defaultValue as never);
        }
    }, [defaultValue, control, name]);

    const renderInputField = (listIndex: number, fieldIndex?: string, fieldConfig?: FieldConfig<T>): ReactNode => {
        const fieldPath = `${name}.${listIndex}` as Path<T>

        if (fieldConfig) {
            const longFieldPath = fieldConfig.name
                ? `${name ? name + '.' : ''}${listIndex}.${fieldConfig.name}` as Path<T>
                :  fieldPath as Path<T>

            // Get the default value for this specific field
            let fieldDefaultValue = undefined;
            if (defaultValue && Array.isArray(defaultValue) && defaultValue[listIndex]) {
                const itemData = defaultValue[listIndex];
                if (fieldConfig.name.includes('.')) {
                    // Handle nested fields like 'template.semesterName'
                    const parts = fieldConfig.name.split('.');
                    let current = itemData;
                    for (const part of parts) {
                        current = current?.[part];
                        if (current === undefined) break;
                    }
                    fieldDefaultValue = current;
                } else {
                    fieldDefaultValue = itemData[fieldConfig.name];
                }
            }

            const props = {
                ...fieldConfig,
                name: longFieldPath,
                defaultValue: fieldDefaultValue
            };

            switch (fieldConfig.type) {
                case 'date':
                    return <DateInput key={fieldIndex} {...props} md={props.md} lg={props.lg} hasForm={false} />
                case 'number':
                    return <TextInput.Number key={fieldIndex} {...props} md={props.md} lg={props.lg} hasForm={false} />
                case 'select':
                    return <SelectInput key={fieldIndex} {...props} md={props.md} lg={props.lg} hasForm={false} />
                case 'radio':
                    return <RadioInput key={fieldIndex} {...props} md={props.md} lg={props.lg} hasForm={false} />
                default:
                    return <TextInput key={fieldIndex} {...props} md={props.md} lg={props.lg} hasForm={false} />
            }
        }

        // For non-configured fields, try to get the default value
        let fieldDefaultValue = undefined;
        if (defaultValue && Array.isArray(defaultValue) && defaultValue[listIndex]) {
            fieldDefaultValue = defaultValue[listIndex];
        }

        return <TextInput {...listProps} md={24} lg={24} name={fieldPath} defaultValue={fieldDefaultValue} hasForm={false} />
    }

    const handleRemove = (remove: (index: number | number[]) => void, index: number) => {
        if (control) {
            // Get current form values
            const currentValues = control._formValues
            const listValues = currentValues[name] as never[]
            console.log({currentValues, listValues, name})

            if (Array.isArray(listValues)) {
                // Remove the item from the array
                listValues.splice(index, 1)
                // Update React Hook Form
                control._subjects.state.next(listValues as never);
            }
        }

        // Call the original remove function
        remove(index)
    }

    const content = (
        <Form.List name={listName as string} initialValue={defaultValue as []}>
            {(fields, {add, remove}) => (
                <>
                    <Form.Item>
                        <Button type='dashed' onClick={
                            () => {
                                if (formFields && formFields?.length > 0) {
                                    // Add an empty structured object
                                    const emptyItem = formFields.reduce((acc, field) => {
                                        if (field.name.includes('.')) {
                                            const parts = field.name.split('.');
                                            let current = acc;
                                            for (let i = 0; i < parts.length - 1; i++) {
                                                if (!current[parts[i]]) {
                                                    current[parts[i]] = {};
                                                }
                                                current = current[parts[i]] as never;
                                            }
                                            current[parts[parts.length - 1]] = '';
                                        } else {
                                            acc[field.name] = '';
                                        }
                                        return acc;
                                    }, {} as Record<string, unknown>);
                                    add(emptyItem);
                                } else {
                                    add({});
                                }
                            }
                        } icon={<LuPlus />}>{itemLabel}</Button>
                    </Form.Item>
                    {fields.map(({key}, index) => (
                        <div style={{
                            border: '1px solid #d9d9d9', borderRadius: '5px', padding: '5px', marginBottom: '10px', background: '#e0e1e4',
                        }} key={key}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '8px',
                            }}>
                                <h4 style={{ margin: 0, color: '#666' }}>
                                    {itemLabel} {fields.length > 1 ? index + 1 : ''}
                                </h4>
                                {fields.length > 0 && (
                                    <Button
                                        type="text"
                                        danger
                                        size="small"
                                        icon={<LuCircleMinus />}
                                        onClick={() => handleRemove(remove, index)}
                                    />
                                )}
                            </div>
                            <Responsive gutter={[16, 16]}>
                                {formFields && formFields?.length > 0 ? formFields?.map((field, fieldIndex) => (
                                    renderInputField(index, `${field?.key}-${fieldIndex}`, field)
                                )) : (
                                    renderInputField(index)
                                )}
                            </Responsive>
                        </div>
                    ))}
                </>
            )}
        </Form.List>
    )

    const formList = (
        isCompact ? <Form layout='vertical' onFinish={onFinish}>
            {content}
            <Form.Item style={{marginBottom: 0}}>
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

    const handleFinish = (values: unknown | unknown[]) => {
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