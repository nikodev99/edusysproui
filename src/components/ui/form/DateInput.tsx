import {Button, DatePicker, Form, Space} from "antd";
import {FieldValues} from "react-hook-form";
import dayjs from "dayjs";
import Grid from "../layout/Grid.tsx";
import {DatePickerType, TypedInputType} from "../../../utils/interfaces.ts";
import FormItem from "./FormItem.tsx";
import {LuSave} from "react-icons/lu";

export const FormDateInput = <T extends FieldValues>(datePickerProps: DatePickerType<T>) => {

    const {isCompact, placeholder, buttonLabel} = datePickerProps

    return(
        <FormItem {...datePickerProps} render={({field}) => (
            <>
                {isCompact ? (
                    <Space.Compact style={{ width: '100%' }}>
                        <DatePicker
                            {...field}
                            format="DD/MM/YYYY"
                            placeholder={placeholder}
                            style={{width: '100%'}}
                            onChange={(date) => field.onChange(date ? date.toDate() : null)}
                            value={field.value ? dayjs(field.value) : null}
                        />
                        <Button disabled={true}>{buttonLabel ?? <LuSave />}</Button>
                    </Space.Compact>
                ) : (
                    <DatePicker
                        {...field}
                        format="DD/MM/YYYY"
                        placeholder={placeholder}
                        style={{width: '100%'}}
                        onChange={(date) => field.onChange(date ? date.toDate() : null)}
                        value={field.value ? dayjs(field.value) : null}
                    />
                )}
            </>
        )} />
    )
}

const DateInput = <T extends FieldValues>(dateInputProps: TypedInputType<T>) => {

    const {xs, md, lg, hasForm, onFinish} = dateInputProps

    return(
        <Grid xs={xs ?? 24} md={md ?? 12} lg={lg ?? 8}>
            {hasForm ? (
                <Form layout='vertical' onFinish={onFinish}>
                    <FormDateInput {...dateInputProps} isCompact={hasForm} />
                </Form>
            ) : (
                <FormDateInput {...dateInputProps} />
            )}
        </Grid>
    )
}

export default DateInput