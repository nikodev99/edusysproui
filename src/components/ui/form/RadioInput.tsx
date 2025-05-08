import {FieldValues} from "react-hook-form";
import {SelectType, TypedInputType, ZodRadio} from "../../../core/utils/interfaces.ts";
import FormItem from "./FormItem.tsx";
import {Form, Radio, Space} from "antd";
import Grid from "../layout/Grid.tsx";
import {CSSProperties} from "react";

export const FormRadioInput = <T extends FieldValues>(radioProps: SelectType<T> & ZodRadio<T>) => {

    const {isCompact, radioOptions, selectedValue, optionType, buttonStyle, clearErrors, style} = radioProps

    return(
        <FormItem {...radioProps} {...(selectedValue ? { defaultValue: selectedValue } : {})} render={({field}) => (
            <>
                {isCompact ? (
                    <Space.Compact style={{ width: '100%' }}>
                        <Radio.Group
                            options={radioOptions}
                            optionType={optionType}
                            buttonStyle={buttonStyle}
                            onFocus={() => clearErrors ? clearErrors(field.name) : null}
                            style={style}
                            block
                            {...field}
                        />
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

    const verticalRadio: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    };

    return(
        <Grid xs={xs ?? 24} md={md ?? 12} lg={lg ?? 8}>
            {hasForm ? (
                <Form layout='vertical' onFinish={handleFinish}>
                    <FormRadioInput {...radioProps} isCompact={hasForm} style={verticalRadio} />
                </Form>
            ) : (
                <FormRadioInput {...radioProps} />
            )}
        </Grid>
    )
}

export default RadioInput
