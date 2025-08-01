import {FieldValues} from "react-hook-form";
import {Button, Form, Input, InputNumber, Space} from "antd";
import {InputType, TypedInputType} from "../../../core/utils/interfaces.ts";
import Grid from "../layout/Grid.tsx";
import {LuSave} from "react-icons/lu";
import FormItem from "./FormItem.tsx";
import {useState} from "react";

type dataEntryProps<T extends FieldValues> = InputType<T> & {inputType?: string}

export const FormInput = <T extends FieldValues>(inputProps: dataEntryProps<T>) => {

    const [passwordVisible, setPasswordVisible] = useState(false);
    const {placeholder, isCompact, buttonLabel, inputType, addonAfter, min, defaultValue, disabled, clearErrors} = inputProps

    return(
        <FormItem {...inputProps} render={({field}) => (
            <>
                {isCompact ? (
                        <Space.Compact style={{width: '100%'}}>
                            {inputType === 'number' && <InputNumber
                                placeholder={placeholder}
                                disabled={disabled}
                                min={min}
                                {...field}
                                style={{width: '100%'}}
                            />}
                            {inputType === 'password' && <Input.Password
                                placeholder={placeholder}
                                visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                                disabled={disabled}
                                onFocus={() => clearErrors ? clearErrors(field.name) : null}
                                {...field}
                            />}
                            {!inputType && <Input
                                onFocus={() => clearErrors ? clearErrors(field.name) : null}
                                placeholder={placeholder}
                                {...field}
                            />}
                            <Button disabled={field.value === defaultValue} htmlType='submit'>{buttonLabel ?? <LuSave/>}</Button>
                        </Space.Compact>
                    ) :
                    (
                        <>
                            {inputType === 'number' && <InputNumber
                                placeholder={placeholder}
                                disabled={disabled}
                                addonAfter={addonAfter}
                                onFocus={() => clearErrors ? clearErrors(field.name) : null}
                                min={min}
                                {...field}
                                style={{width: '100%'}}
                            />}
                            {inputType === 'password' && <Input.Password
                                placeholder={placeholder}
                                visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                                disabled={disabled}
                                onFocus={() => clearErrors ? clearErrors(field.name) : null}
                                {...field}
                            />}
                            {!inputType && <Input
                                onFocus={() => clearErrors ? clearErrors(field.name) : null}
                                placeholder={placeholder}
                                addonAfter={addonAfter}
                                {...field}
                            />}
                        </>
                    )
                }
            </>
        )}/>
    )
}

const TextInput = <T extends FieldValues>(inputProps :TypedInputType<T>) => {
    const { hasForm, xs, md, lg, onFinish, inputType} = inputProps

    const handleFinish = (values: unknown) => {
        if (onFinish) {
            onFinish(values)
        }
    }

    console.log(xs, md, lg)

    return(
        <Grid xs={xs ?? 24} md={md ?? 12} lg={lg ?? 8}>
            {hasForm ? (
                    <Form layout="vertical" onFinish={handleFinish}>
                        <FormInput {...inputProps} isCompact={hasForm} inputType={inputType} />
                    </Form>
                ) :
                (
                    <FormInput {...inputProps} inputType={inputType} />
                )
            }
        </Grid>
    )
}

TextInput.Email = <T extends FieldValues>(props: Omit<TypedInputType<T>, 'type'>) => (
    <TextInput {...props} inputType='email' />
)

TextInput.Password = <T extends FieldValues>(props: Omit<TypedInputType<T>, 'type'>) => (
    <TextInput {...props} inputType='password' />
)

TextInput.Number = <T extends FieldValues>(props: Omit<TypedInputType<T>, 'type'>) => (
    <TextInput {...props} inputType='number' />
)

export default TextInput