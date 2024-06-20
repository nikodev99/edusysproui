import {Form, Select, SelectProps, Spin} from "antd";
import {useMemo} from "react";

interface GuardianDetailsProps {
    data: SelectProps['options'],
    value?: string,
    fetching?: boolean,
    onSearch?: (value: string) => void,
    onChange?: (value: string) => void,
}

const GuardianDetails = ({data, value, fetching, onSearch, onChange}: GuardianDetailsProps) => {

    const filterOption = (input: string, option?: { label: string; value: string }) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const options = useMemo(() => data?.map(d => ({
        value: d.value as string,
        label: d.text,
    })), [data])

    return(
        <>
            <Form>
                <Form.Item>
                    <Select
                        showSearch
                        value={value}
                        placeholder='Entrer les noms, prenoms ou numéro de téléphone du tuteur pour rechercher'
                        defaultActiveFirstOption={false}
                        suffixIcon={null}
                        filterOption={filterOption}
                        onSearch={onSearch}
                        onChange={onChange}
                        notFoundContent={fetching ? <Spin size='small' /> : null}
                        options={options}
                    />
                </Form.Item>
            </Form>
        </>
    )
}

export default GuardianDetails;