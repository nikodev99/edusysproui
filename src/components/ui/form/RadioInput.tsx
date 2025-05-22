import {FieldValues} from "react-hook-form";
import {SelectType, TypedInputType, ZodRadio} from "../../../core/utils/interfaces.ts";
import FormItem from "./FormItem.tsx";
import {Button, Form, Radio, Space} from "antd";
import Grid from "../layout/Grid.tsx";
import {LuSave} from "react-icons/lu";

export const FormRadioInput = <T extends FieldValues>(radioProps: SelectType<T> & ZodRadio<T>) => {

    const {isCompact, radioOptions, selectedValue, optionType, buttonStyle, clearErrors, style, defaultValue, buttonLabel} = radioProps

    return(
        <FormItem {...radioProps} {...(selectedValue ? { defaultValue: selectedValue } : {})} render={({field}) => (
            <>
                {isCompact ? (
                    <Space.Compact style={{ width: '100%' }} block={false}>
                        <Radio.Group
                            options={radioOptions}
                            optionType={optionType}
                            buttonStyle={buttonStyle}
                            onFocus={() => clearErrors ? clearErrors(field.name) : null}
                            style={style}
                            block
                            {...field}
                        />
                        <Button disabled={field.value === defaultValue} htmlType='submit'>{buttonLabel ?? <LuSave />}</Button>
                    </Space.Compact>
                ) : (
                    <Radio.Group
                        options={radioOptions}
                        optionType={optionType}
                        buttonStyle={buttonStyle}
                        onFocus={() => clearErrors ? clearErrors(field.name) : null}
                        style={style}
                        block
                        {...field}
                    />
                )}
            </>
        )} />
    )
}

const RadioInput = <T extends FieldValues>(radioProps: TypedInputType<T>) => {
    const {xs, md, lg, hasForm, onFinish} = radioProps

    const handleFinish = (values: unknown) => {
        if (onFinish) {
            onFinish(values)
        }
    }

    return(
        <Grid xs={xs ?? 24} md={md ?? 12} lg={lg ?? 8}>
            {hasForm ? (
                <Form layout='vertical' onFinish={handleFinish}>
                    <FormRadioInput {...radioProps} isCompact={hasForm} /*style={verticalRadio}*/ />
                </Form>
            ) : (
                <FormRadioInput {...radioProps} />
            )}
        </Grid>
    )
}

export default RadioInput
