import { Button, Form, Select, Space } from "antd";
import { FieldValues } from "react-hook-form";
import Grid from "../layout/Grid.tsx";
import { LuSave } from "react-icons/lu";
import {SelectType, TypedInputType} from "../../../utils/interfaces.ts";
import FormItem from "./FormItem.tsx";

export const FormSelect = <T extends FieldValues>(selectProps: SelectType<T>) => {

    const {isCompact, placeholder, options, selectedValue} = selectProps

    return(
        <FormItem {...selectProps} {...(selectedValue ? { defaultValue: selectedValue } : {})} render={({field}) => (
            <>
                {isCompact ? (
                    <Space.Compact style={{ width: '100%' }}>
                        <Select
                            placeholder={placeholder} options={options} {...field} />
                        <Button htmlType='submit' disabled={true}><LuSave /></Button>
                    </Space.Compact>
                ) : (
                    <Select placeholder={placeholder} options={options} {...field} />
                )}
            </>
        )} />
    )
}

const SelectInput = <T extends FieldValues>(selectProps: TypedInputType<T>) => {

    const {xs, md, lg, hasForm, onFinish} = selectProps

    return(
        <Grid xs={xs ?? 24} md={md ?? 12} lg={ lg ?? 8}>
            {hasForm ? (
                <Form layout="vertical" onFinish={onFinish}>
                    <FormSelect {...selectProps} isCompact={hasForm} />
                </Form>
            ): (
                <FormSelect {...selectProps} />
            )}

        </Grid>
    )
}

export default SelectInput