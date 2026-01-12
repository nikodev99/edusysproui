import {FieldValues, Path, PathValue} from "react-hook-form";
import {Button, Form, Input, InputNumber, Space} from "antd";
import {InputType, TypedInputType} from "@/core/utils/interfaces.ts";
import Grid from "@/components/ui/layout/Grid.tsx";
import {LuSave} from "react-icons/lu";
import FormItem from "./FormItem.tsx";
import {useState} from "react";

type dataEntryProps<T extends FieldValues> = InputType<T> & {inputType?: string}

export const FormInput = <T extends FieldValues>(inputProps: dataEntryProps<T>) => {

    const [passwordVisible, setPasswordVisible] = useState(false);
    const {placeholder, isCompact, buttonLabel, inputType, addonAfter, min, defaultValue, disabled, clearErrors} = inputProps

    return(
        <FormItem {...inputProps} render={({field}) => (
            <>{isCompact ? (
                <Space.Compact style={{width: '100%'}}>
                    {addonAfter && <Space.Addon>
                        {addonAfter}
                    </Space.Addon>}
                    {inputType === 'number' && <InputNumber
                        placeholder={placeholder as string}
                        disabled={disabled}
                        min={min}
                        {...field}
                        defaultValue={defaultValue}
                        style={{width: '100%'}}
                    />}
                    {inputType === 'password' && <Input.Password
                        placeholder={placeholder as string}
                        visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                        disabled={disabled}
                        onFocus={() => clearErrors ? clearErrors(field.name) : null}
                        {...field}
                        defaultValue={defaultValue as PathValue<T, Path<T>>}
                    />}
                    {inputType === 'text_area' && <Input.TextArea
                        placeholder={placeholder as string}
                        disabled={disabled}
                        onFocus={() => clearErrors ? clearErrors(field.name) : null}
                        {...field}
                        defaultValue={defaultValue as PathValue<T, Path<T>>}
                        autoSize={{minRows: 3, maxRows: 5}}
                    />}
                    {!inputType && <Input
                        onFocus={() => clearErrors ? clearErrors(field.name) : null}
                        placeholder={placeholder as string}
                        {...field}
                        defaultValue={defaultValue as PathValue<T, Path<T>>}
                    />}
                    <Button disabled={field.value === defaultValue} htmlType='submit'>{buttonLabel ?? <LuSave/>}</Button>
                </Space.Compact>
            ) :
            (
                <>
                    {inputType === 'number' && (addonAfter ? (
                        <Space.Compact>
                            <Space.Addon>
                                {addonAfter}
                            </Space.Addon>
                            <InputNumber
                                placeholder={placeholder as string}
                                disabled={disabled}
                                onFocus={() => clearErrors ? clearErrors(field.name) : null}
                                min={min}
                                {...field}
                                style={{width: '100%'}}
                                defaultValue={defaultValue}
                            />
                        </Space.Compact>
                    ) : (
                        <InputNumber
                            placeholder={placeholder as string}
                            disabled={disabled}
                            onFocus={() => clearErrors ? clearErrors(field.name) : null}
                            min={min}
                            {...field}
                            style={{width: '100%'}}
                            defaultValue={defaultValue}
                        />
                    ))}
                    {inputType === 'password' && <Input.Password
                        placeholder={placeholder as string}
                        visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                        disabled={disabled}
                        onFocus={() => clearErrors ? clearErrors(field.name) : null}
                        {...field}
                        defaultValue={defaultValue as PathValue<T, Path<T>>}
                    />}
                    {inputType === 'text_area' && <Input.TextArea
                        placeholder={placeholder as string}
                        disabled={disabled}
                        onFocus={() => clearErrors ? clearErrors(field.name) : null}
                        {...field}
                        defaultValue={defaultValue as PathValue<T, Path<T>>}
                        autoSize
                    />}
                    {!inputType && (addonAfter ? (
                        <Space.Compact>
                            <Space.Addon>
                                {addonAfter}
                            </Space.Addon>
                            <Input
                                onFocus={() => clearErrors ? clearErrors(field.name) : null}
                                placeholder={placeholder as string}
                                {...field}
                                defaultValue={defaultValue as PathValue<T, Path<T>>}
                            />
                        </Space.Compact>
                    ): (
                        <Input
                            onFocus={() => clearErrors ? clearErrors(field.name) : null}
                            placeholder={placeholder as string}
                            {...field}
                            defaultValue={defaultValue as PathValue<T, Path<T>>}
                        />
                    ))}
                </>
            )}
            </>
        )}/>
    )
}

const TextInput = <T extends FieldValues>(inputProps :TypedInputType<T>) => {
    const { hasForm, xs, md, lg, onFinish, inputType, hide} = inputProps

    const handleFinish = (values: unknown) => {
        if (onFinish) {
            onFinish(values)
        }
    }

    return(
        <Grid xs={xs ?? 24} md={md ?? 12} lg={lg ?? 8} style={{display: hide ? 'none' : 'block'}}>
            {hasForm ? (
                    <Form layout="vertical" onFinish={handleFinish}>
                        <FormInput {...inputProps} isCompact={hasForm} inputType={inputType} />
                    </Form>
                ) :
                (
                    <FormInput {...inputProps} isCompact={false} inputType={inputType} />
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

TextInput.TextArea = <T extends FieldValues>(props: Omit<TypedInputType<T>, 'type'>) => (
    <TextInput {...props} inputType='text_area' />
)

export default TextInput