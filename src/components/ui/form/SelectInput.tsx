import {Button, Form, Select, Space} from "antd";
import { FieldValues } from "react-hook-form";
import Grid from "../layout/Grid.tsx";
import { LuSave } from "react-icons/lu";
import {SelectType, TypedInputType} from "../../../core/utils/interfaces.ts";
import FormItem from "./FormItem.tsx";

export const FormSelect = <T extends FieldValues>(selectProps: SelectType<T>) => {

    const {
        isCompact, placeholder, options, showSearch, selectedValue, filterOption, mode, clearErrors, disabled, onSearch,
        defaultValue, onChange
    } = selectProps

    const handleFilterOption = (input: string, option?: { label: string; value: string }) => {
        return typeof filterOption === 'function'
            ? filterOption(input, option)
            : filterOption === true ? (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) : undefined;
    }

    return(
        <FormItem {...selectProps} defaultValue={defaultValue || selectedValue} render={({field}) => {
            return(
                <>
                    {isCompact ? (
                        <Space.Compact style={{ width: '100%' }}>
                            <Select
                                placeholder={placeholder}
                                options={options as []}
                                optionFilterProp='label'
                                filterOption={handleFilterOption as never}
                                mode={mode}
                                onFocus={() => clearErrors ? clearErrors(field.name) : null}
                                disabled={field.disabled || disabled}
                                {...field}
                                value={field.value || selectedValue}
                                onSearch={onSearch}
                                showSearch={showSearch}
                                onChange={field.onChange || onChange}
                            />
                            <Button htmlType='submit' disabled={disabled ? disabled : field.value === selectedValue}><LuSave /></Button>
                        </Space.Compact>
                    ) : (
                        <Select
                            placeholder={placeholder}
                            options={options as []}
                            optionFilterProp='label'
                            filterOption={handleFilterOption as never}
                            onFocus={() => clearErrors ? clearErrors(field.name) : null}
                            mode={mode as "tags"}
                            disabled={field.disabled || disabled}
                            {...field}
                            value={field.value || selectedValue}
                            onSearch={onSearch}
                            showSearch={showSearch}
                            onChange={field.onChange || onChange}
                        />
                    )}
                </>
            )
        }} />
    )
}

const SelectInput = <T extends FieldValues>(selectProps: TypedInputType<T>) => {

    const {xs, md, lg, hasForm, onFinish} = selectProps

    const handleFinish = (values: unknown) => {
        if (onFinish) {
            onFinish(values)
        }
    }

    return(
        <Grid xs={xs ?? 24} md={md ?? 12} lg={ lg ?? 8}>
            {hasForm ? (
                <Form layout="vertical" onFinish={handleFinish}>
                    <FormSelect {...selectProps} isCompact={hasForm} />
                </Form>
            ): (
                <FormSelect {...selectProps} />
            )}

        </Grid>
    )
}

export default SelectInput