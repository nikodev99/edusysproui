import Grid from "../layout/Grid.tsx";
import {FieldValues, Path, PathValue} from "react-hook-form";
import {TimeInputType, TypedInputType} from "@/core/utils/interfaces.ts";
import FormItem from "./FormItem.tsx";
import {Button, Form, Space, TimePicker} from "antd";
import dayjs from "dayjs";
import {LuSave} from "react-icons/lu";
import Datetime from "@/core/datetime.ts";

export const FormTimeInput = <T extends FieldValues>(timePickerProps: TimeInputType<T>) => {

    const {isCompact, placeholder, clearErrors, defaultValue, buttonLabel, disabled} = timePickerProps

    return(
        <FormItem {...timePickerProps} render={({field}) => (
            <>
                {isCompact
                    ? (
                        <Space.Compact style={{width: '100%'}}>
                            <TimePicker
                                {...field}
                                placeholder={placeholder as string}
                                onChange={(time) => field.onChange(time ? time.toDate() : null)}
                                onFocus={() => clearErrors ? clearErrors(field.name) : null}
                                value={field.value ? Datetime.timeToCurrentDate(field.value).toDayjs() : null}
                                defaultValue={Datetime.timeToCurrentDate(defaultValue as number[]).toDate() as PathValue<T, Path<T>>}
                                format="HH:mm"
                                allowClear
                                style={{width: '100%'}}
                                disabled={disabled}
                            />
                            <Button disabled={field.value === defaultValue} htmlType='submit'>{buttonLabel ?? <LuSave />}</Button>
                        </Space.Compact>
                    )
                    : (
                        <TimePicker
                            {...field}
                            placeholder={placeholder as string}
                            onChange={(time) => field.onChange(time ? time.toDate() : null)}
                            onFocus={() => clearErrors ? clearErrors(field.name) : null}
                            value={field.value ? dayjs(field.value) : null}
                            format="HH:mm"
                            style={{width: '100%'}}
                            allowClear
                        />
                    )
                }
            </>
        )} />
    )
}

export const TimeInput = <T extends FieldValues>(timeProps: TypedInputType<T>) => {

    const {xs, lg, md, hasForm, onFinish} = timeProps

    return(
        <Grid xs={xs ?? 24} md={md ?? 12} lg={lg ?? 8}>
            {hasForm
                ? (
                    <Form layout='vertical' onFinish={(values) => onFinish && onFinish(values)}>
                        <FormTimeInput {...timeProps} isCompact={hasForm} />
                    </Form>
                )
                : (
                    <FormTimeInput {...timeProps} />
                )
            }
        </Grid>
    )
}