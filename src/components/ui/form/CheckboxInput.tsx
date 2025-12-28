import {FieldValues} from "react-hook-form";
import {TypedInputType} from "@/core/utils/interfaces.ts";
import FormItem from "@/components/ui/form/FormItem.tsx";
import {Checkbox, Form, Space} from "antd";
import Grid from "@/components/ui/layout/Grid.tsx";

export const CheckboxForm = <T extends FieldValues>(
    checkboxProps: TypedInputType<T> & {isCompact?: boolean}
) => {

    const {defaultValue, isCompact, options, checkLabel} = checkboxProps

    return(
        <FormItem {...checkboxProps} defaultValue={defaultValue} render={({field}) => {
            return(
                <>
                    {isCompact ? (
                        <Space.Compact>
                            {options ? (
                                <Checkbox.Group
                                    options={options as []}
                                    defaultValue={[defaultValue]}
                                    value={field.value}
                                    onChange={field.onChange}
                                    {...field}
                                />
                            ) : (
                                <Checkbox
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                    {...field}
                                >
                                    {checkLabel}
                                </Checkbox>
                            )}
                        </Space.Compact>
                    ) : (
                        <>
                        {options ? (
                            <Checkbox.Group
                                options={options as []}
                                defaultValue={[defaultValue]}
                                value={field.value}
                                onChange={field.onChange}
                                {...field}
                            />
                        ) : (
                            <Checkbox
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                {...field}
                            >
                                {checkLabel}
                            </Checkbox>
                        )}
                        </>
                    )}
                </>
            )
        }} />
    )
}

const CheckboxInput = <T extends FieldValues>(checkboxProps: TypedInputType<T>) => {
    const {xs, md, lg, hasForm, onFinish} = checkboxProps

    const handleFinish = (values: unknown) => {
        if (onFinish) {
            onFinish(values)
        }
    }

    return(
        <Grid xs={xs ?? 24} md={md ?? 12} lg={ lg ?? 8}>
            {hasForm ? (
                <Form layout="vertical" onFinish={handleFinish}>
                    <CheckboxForm {...checkboxProps} isCompact={hasForm} />
                </Form>
            ): (
                <CheckboxForm {...checkboxProps} />
            )}
        </Grid>
    )
}

export default CheckboxInput