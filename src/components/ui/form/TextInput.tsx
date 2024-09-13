import {FieldValues} from "react-hook-form";
import {Button, Form, Input, Space} from "antd";
import {InputType, TypedInputType} from "../../../utils/interfaces.ts";
import Grid from "../layout/Grid.tsx";
import {LuSave} from "react-icons/lu";
import FormItem from "./FormItem.tsx";

export const FormInput = <T extends FieldValues>(inputProps: InputType<T>) => {

    const {placeholder, isCompact, buttonLabel} = inputProps

    return(
        <FormItem {...inputProps} render={({field}) => (
            <>
                {isCompact ? (
                        <Space.Compact style={{ width: '100%' }}>
                            <Input placeholder={placeholder} {...field} />
                            <Button disabled={true}>{buttonLabel ?? <LuSave />}</Button>
                        </Space.Compact>
                    ) :
                    (
                        <Input placeholder={placeholder} {...field} />
                    )
                }
            </>
        )}/>
    )
}

const TextInput = <T extends FieldValues>(inputProps :TypedInputType<T>) => {
    const { hasForm, xs, md, lg, onFinish} = inputProps

    return(
        <Grid xs={xs ?? 24} md={md ?? 12} lg={lg ?? 8}>
            {hasForm ? (
                    <Form layout="vertical" onFinish={onFinish}>
                        <FormInput {...inputProps} isCompact={hasForm} />
                    </Form>
                ) :
                (
                    <FormInput {...inputProps} />
                )
            }
        </Grid>
    )
}

TextInput.Email = <T extends FieldValues>(props: Omit<TypedInputType<T>, 'type'>) => (
    <TextInput {...props} type='email' />
)

TextInput.Password = <T extends FieldValues>(props: Omit<TypedInputType<T>, 'type'>) => (
    <TextInput {...props} type='password' />
)

export default TextInput