import {ControllerRenderProps, FieldValues} from "react-hook-form";
import {SelectType, TypedInputType, ZodRadio} from "../../../core/utils/interfaces.ts";
import FormItem from "./FormItem.tsx";
import {Button, Form, Radio, RadioChangeEvent, Space} from "antd";
import Grid from "../layout/Grid.tsx";
import {LuSave} from "react-icons/lu";
import {useCallback, useState} from "react";

export const FormRadioInput = <T extends FieldValues>(radioProps: SelectType<T> & ZodRadio<T>) => {
    const [selectedId, setSelectedId] = useState<object | null>(null);
    const {isCompact, radioOptions, selectedValue, key, optionType, buttonStyle = 'solid', clearErrors, style, defaultValue, buttonLabel, isValueObject = false} = radioProps

    const processedRadioOptions = radioOptions?.map((option, index) => {
        const originalValue = option?.value;

        let uniqueValue;
        if (typeof originalValue === 'object' && originalValue !== null) {
            uniqueValue = option?.id;
        } else if (originalValue === undefined || originalValue === null) {
            uniqueValue = `undefined_${index}`;
        } else {
            uniqueValue = originalValue
        }

        return {
            ...option,
            value: uniqueValue,
        };
    });

    const handleChange = useCallback((e:  RadioChangeEvent, field: ControllerRenderProps<T>) => {
        const id = e.target.value;
        setSelectedId(id);

        // Find and return the full value object
        const selectedOption = radioOptions?.find(opt => opt.id === id);
        if (selectedOption) {
            const selectedValue = selectedOption.value;
            console.log("Selected Value:", selectedValue);
            field.onChange(selectedValue);
            return selectedValue;
        }
        field.onChange(e.target.value);
    }, [radioOptions]);
    
    const radioGroup = useCallback((field: ControllerRenderProps<T>) => (
        <Radio.Group
            options={processedRadioOptions}
            optionType={optionType}
            buttonStyle={buttonStyle}
            onFocus={() => clearErrors ? clearErrors(field.name) : null}
            style={style}
            block
            {...field}
            {...(isValueObject ? { onChange: (e) => handleChange(e, field) } : {})}
            {...(isValueObject ? { value: selectedId } : {value: field.value})}
        >
            {processedRadioOptions?.map((option, index) => {
                const RadioComponent = optionType === 'button' ? Radio.Button : Radio;
                return (
                    <RadioComponent
                        key={`explicit_radio_${index}_${option.id}`} // Explicit unique key
                        value={option.value}
                        style={buttonStyle ? { ...option.style } : option.style}
                    >
                        {option.label}
                    </RadioComponent>
                );
            })}
        </Radio.Group>
    ), [buttonStyle, clearErrors, handleChange, isValueObject, optionType, processedRadioOptions, selectedId, style])

    return(
        <FormItem key={key} {...radioProps} {...(selectedValue ? { defaultValue: selectedValue } : {})} render={({field}) => (
            <>
                {isCompact ? (
                    <Space.Compact style={{ width: '100%' }} block={false}>
                        {radioGroup(field)}
                        <Button disabled={field.value === defaultValue} htmlType='submit'>{buttonLabel ?? <LuSave />}</Button>
                    </Space.Compact>
                ) : (
                    radioGroup(field)
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
