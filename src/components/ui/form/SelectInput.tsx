import {InputProps} from "../../../utils/interfaces.ts";
import {Button, Form, Select, Space} from "antd";
import {Controller} from "react-hook-form";
import Grid from "../layout/Grid.tsx";
import {LuSave} from "react-icons/lu";

interface SelectProps extends InputProps {
    options: {value: string | number, label: string | number}[],
    selectedValue?: string
}

const SelectInput = ({
     control, label, validateStatus, help, name, placeholder, options, selectedValue,
    xs, md, lg, isCompact, onFinish
}: SelectProps) => {
    return(
        <Grid xs={xs ?? 24} md={md ?? 12} lg={ lg ?? 8}>
            {isCompact ? (
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item label={label} required tooltip='requis' validateStatus={validateStatus} help={help}>
                        <Controller name={name as 'academicYear.id'} defaultValue={selectedValue ? selectedValue : ''} control={control} render={({field}) => (
                            <Space.Compact style={{ width: '100%' }}>
                                <Select placeholder={placeholder} options={options} {...field} />
                                <Button htmlType='submit' disabled={true}><LuSave /></Button>
                            </Space.Compact>
                        )} />
                    </Form.Item>
                </Form>
                ): (
                <Form.Item label={label} required tooltip='requis' validateStatus={validateStatus} help={help}>
                    <Controller name={name as 'academicYear.id'} control={control} render={({field}) => (
                        <Select placeholder={placeholder} options={options} {...field} />
                    )} />
                </Form.Item>
            )}

        </Grid>
    )
}

export default SelectInput