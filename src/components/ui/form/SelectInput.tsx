import { Button, Form, Select, Space } from "antd";
import { FieldValues } from "react-hook-form";
import Grid from "../layout/Grid.tsx";
import { LuSave } from "react-icons/lu";
import {SelectType, TypedInputType} from "../../../utils/interfaces.ts";
import FormItem from "./FormItem.tsx";

export const FormSelect = <T extends FieldValues>(selectProps: SelectType<T>) => {

    const {isCompact, placeholder, options, showSearch, selectedValue, filterOption, mode, clearErrors} = selectProps

    return(
        <FormItem {...selectProps} {...(selectedValue ? { defaultValue: selectedValue } : {})} render={({field}) => (
            <>
                {isCompact ? (
                    <Space.Compact style={{ width: '100%' }}>
                        <Select
                            showSearch={showSearch}
                            placeholder={placeholder}
                            options={options}
                            optionFilterProp='label'
                            filterOption={filterOption as boolean}
                            mode={mode}
                            onFocus={() => clearErrors ? clearErrors(field.name) : null}
                            {...field}
                        />
                        <Button htmlType='submit' disabled={field.value === selectedValue}><LuSave /></Button>
                    </Space.Compact>
                ) : (
                    <Select
                        showSearch={showSearch}
                        placeholder={placeholder}
                        options={options}
                        optionFilterProp='label'
                        filterOption={filterOption as boolean}
                        onFocus={() => clearErrors ? clearErrors(field.name) : null}
                        mode={mode as "tags"}
                        {...field}
                    />
                )}
            </>
        )} />
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