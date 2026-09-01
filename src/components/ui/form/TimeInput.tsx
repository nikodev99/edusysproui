import Grid from "../layout/Grid.tsx";
import {FieldValues, Path, PathValue} from "react-hook-form";
import {TimeInputType, TypedInputType} from "@/core/utils/interfaces.ts";
import FormItem from "./FormItem.tsx";
import {Button, Form, Space, TimePicker, TimePickerProps} from "antd";
import {LuSave} from "react-icons/lu";
import Datetime from "@/core/datetime.ts";
import {useCallback} from "react";
import {Dayjs} from "dayjs";

export const FormTimeInput = <T extends FieldValues>(timePickerProps: TimeInputType<T>) => {

    const {isCompact, placeholder, clearErrors, defaultValue, buttonLabel, disabled, timeRange} = timePickerProps

    const range = (start: number, end: number) =>
        Array.from({ length: end - start }, (_, i) => start + i);

    const getDisabledTime = useCallback((): TimePickerProps['disabledTime'] => {
        if (!timeRange) return undefined;

        const [startHour, startMinute] = timeRange.startTime;
        const [endHour, endMinute] = timeRange.endTime;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return (_date: Dayjs) => ({
            disabledHours: () => [...range(0, startHour), ...range(endHour + 1, 24)],
            disabledMinutes: (selectedHour) => {
                if (selectedHour === startHour) return range(0, startMinute);
                if (selectedHour === endHour) return range(endMinute + 1, 60);
                return [];
            },
        });
    }, [timeRange]);

    return(
        <FormItem {...timePickerProps} render={({field}) => (
            <>
                {isCompact
                    ? (
                        <Space.Compact style={{width: '100%'}}>
                            <TimePicker
                                {...field}
                                placeholder={placeholder as string}
                                onChange={(time) => field.onChange(time)}
                                onFocus={() => clearErrors ? clearErrors(field.name) : null}
                                value={field.value ? Datetime.timeToCurrentDate(field.value).toDayjs() : defaultValue ? Datetime.timeToCurrentDate(defaultValue as number[]).toDayjs() : null}
                                defaultValue={defaultValue ? Datetime.timeToCurrentDate(defaultValue as number[]).toDayjs() as PathValue<T, Path<T>> : undefined}
                                format="HH:mm"
                                allowClear
                                style={{width: '100%'}}
                                disabledTime={getDisabledTime as never}
                                hideDisabledOptions={!!timeRange}
                                disabled={disabled}
                            />
                            <Button disabled={field.value === defaultValue} htmlType='submit'>{buttonLabel ?? <LuSave />}</Button>
                        </Space.Compact>
                    )
                    : (
                        <TimePicker
                            {...field}
                            placeholder={placeholder as string}
                            onChange={(time) => field.onChange(time)}
                            onFocus={() => clearErrors ? clearErrors(field.name) : null}
                            value={
                                field.value
                                    ? Datetime.timeToCurrentDate(field.value).toDayjs()
                                    : defaultValue
                                        ? Datetime.timeToCurrentDate(defaultValue as number[]).toDayjs()
                                        : null
                            }
                            defaultValue={
                                defaultValue
                                    ? Datetime.timeToCurrentDate(defaultValue as number[]).toDayjs()  // ← toDayjs()
                                    : null
                            }
                            format="HH:mm"
                            style={{ width: '100%' }}
                            disabledTime={getDisabledTime as never}
                            hideDisabledOptions={!!timeRange}
                            allowClear
                            disabled={disabled}
                        />
                    )
                }
            </>
        )} />
    )
}

export const TimeInput = <T extends FieldValues>(timeProps: TypedInputType<T>) => {

    const {xs, lg, md, hasForm, onFinish, timeRange} = timeProps

    return(
        <Grid xs={xs ?? 24} md={md ?? 12} lg={lg ?? 8}>
            {hasForm
                ? (
                    <Form layout='vertical' onFinish={(values) => onFinish && onFinish(values)}>
                        <FormTimeInput {...timeProps} isCompact={hasForm} timeRange={timeRange} />
                    </Form>
                )
                : (
                    <FormTimeInput {...timeProps} timeRange={timeRange} />
                )
            }
        </Grid>
    )
}