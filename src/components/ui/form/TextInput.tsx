import {Controller} from "react-hook-form";
import {Button, Form, Input, Space} from "antd";
import {InputProps} from "../../../utils/interfaces.ts";
import Grid from "../layout/Grid.tsx";
import {LuSave} from "react-icons/lu";

const TextInput = (inputProps :InputProps) => {
    const {
        control, defaultValue, name, label, validateStatus, help, style, required, isCompact,
        placeholder, xs, md, lg, onFinish
    } = inputProps

    return(
        <Grid xs={xs ?? 24} md={md ?? 12} lg={lg ?? 8}>
            {isCompact ? (
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        style={style}
                        label={label}
                        required={required}
                        tooltip={required ? 'requis' : undefined}
                        validateStatus={validateStatus}
                        help={help}
                    >
                        <Controller name={name as 'academicYear.id'} defaultValue={defaultValue} control={control} render={({field}) => (
                            <Space.Compact style={{ width: '100%' }}>
                                <Input placeholder={placeholder} {...field} />
                                <Button disabled={true}><LuSave /></Button>
                            </Space.Compact>
                        )} />
                    </Form.Item>
                </Form>
                ) : (
                <Form.Item
                    style={style}
                    label={label}
                    required={required}
                    tooltip={required ? 'requis' : undefined}
                    validateStatus={validateStatus}
                    help={help}
                >
                    <Controller name={name as 'academicYear.id'} defaultValue={defaultValue} control={control} render={({field}) => (
                        <Input placeholder={placeholder} {...field} />
                    )} />
                </Form.Item>
            )}
        </Grid>
    )
}

TextInput.Email = (props: Omit<InputProps, 'type'>) => (
    <TextInput {...props} type='email' />
)

TextInput.Password = (props: Omit<InputProps, 'type'>) => (
    <TextInput {...props} type='password' />
)

export default TextInput