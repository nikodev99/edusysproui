import {Button, DatePicker, Form, Space} from "antd";
import {ControllerRenderProps, FieldValues, Path} from "react-hook-form";
import dayjs from "dayjs";
import Grid from "../layout/Grid.tsx";
import {DatePickerType, TypedInputType} from "@/core/utils/interfaces.ts";
import FormItem from "./FormItem.tsx";
import {LuSave} from "react-icons/lu";
import Datetime from "@/core/datetime.ts";

export const FormDateInput = <T extends FieldValues>(datePickerProps: DatePickerType<T>) => {

    const {isCompact, startDateValue, endDateValue, placeholder, buttonLabel, defaultValue, clearErrors, showTime, format, disabled, min, max, inputType} = datePickerProps

    const DATE_RANGE = (field: ControllerRenderProps<T, Path<T>>) => <DatePicker.RangePicker
        {...field}
        format={format ?? "DD/MM/YYYY"}
        placeholder={placeholder as [string, string]}
        style={{width: '100%'}}
        name={String(`${startDateValue as string}.${endDateValue as string}`) as Path<T>}
        onChange={(dates) => {
            if (dates && dates[0] && dates[1]) {
                field.onChange({
                    startDate: Datetime.of(dates[0]).toDate(),
                    endDate: Datetime.of(dates[1]).toDate(),
                });
            } else {
                field.onChange(undefined);
            }
        }}
        value={field.value && Array.isArray(field.value) ? [dayjs(field.value[0]), dayjs(field.value[1])] : undefined}
        onFocus={() => clearErrors ? clearErrors(field.name) : null}
        showTime={showTime}
        showHour={showTime}
        showMinute={showTime}
        disabled={disabled}
        minDate={min ? Datetime.of(min).toDayjs() : undefined}
        maxDate={max ? Datetime.of(max).toDayjs() : undefined}
    />

    return(
        <FormItem {...datePickerProps} render={({field}) => (
            <>
                {isCompact ? (
                    <Space.Compact style={{ width: '100%' }}>
                        {inputType === 'range' && DATE_RANGE(field)}
                        {!inputType && <DatePicker
                            {...field}
                            format={format ?? "DD/MM/YYYY"}
                            placeholder={placeholder as string}
                            style={{width: '100%'}}
                            onChange={(date) => field.onChange(date ? date.toDate() : null)}
                            onFocus={() => clearErrors ? clearErrors(field.name) : null}
                            value={field.value ? dayjs(field.value) : null}
                            showTime={showTime}
                            showHour={showTime}
                            showMinute={showTime}
                            disabled={disabled}
                            minDate={min ? Datetime.of(min).toDayjs() : undefined}
                            maxDate={max ? Datetime.of(max).toDayjs() : undefined}
                        />}
                        <Button disabled={field.value === defaultValue} htmlType='submit'>{buttonLabel ?? <LuSave />}</Button>
                    </Space.Compact>
                ) : (
                    <>
                    {inputType === 'range' && DATE_RANGE(field)}
                    {!inputType && <DatePicker
                        {...field}
                        format={format ?? "DD/MM/YYYY"}
                        placeholder={placeholder as string}
                        style={{width: '100%'}}
                        onChange={(date) => field.onChange(date ? date.toDate() : null)}
                        value={field.value ? dayjs(field.value) : null}
                        onFocus={() => clearErrors ? clearErrors(field.name) : null}
                        showTime={showTime}
                        showHour={showTime}
                        showMinute={showTime}
                        minDate={min ? Datetime.of(min).toDayjs() : undefined}
                        maxDate={max ? Datetime.of(max).toDayjs() : undefined}
                    />}
                    </>
                )}
            </>
        )} />
    )
}

const DateInput = <T extends FieldValues>(dateInputProps: TypedInputType<T> & {
    format?: string, showTime?: boolean
}) => {

    const {xs, md, lg, hasForm, onFinish} = dateInputProps

    const handleFinish = (values: unknown) => {
        if (onFinish) {
            onFinish(values)
        }
    }

    return(
        <Grid xs={xs ?? 24} md={md ?? 12} lg={lg ?? 8}>
            {hasForm ? (
                <Form layout='vertical' onFinish={handleFinish}>
                    <FormDateInput {...dateInputProps} isCompact={hasForm} />
                </Form>
            ) : (
                <FormDateInput {...dateInputProps} />
            )}
        </Grid>
    )
}

DateInput.Range = <T extends FieldValues>(props: Omit<TypedInputType<T>, 'type'>) => (
    <DateInput {...props} inputType='range' />
)

export default DateInput