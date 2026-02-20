import {Form, Radio, RadioChangeEvent, Select, SelectProps, Spin} from "antd";
import {useMemo, useState} from "react";
import {SearchType} from "@/core/shared/sharedEnums.ts";

interface GuardianDetailsProps {
    data: SelectProps['options'],
    value?: string,
    fetching?: boolean,
    onSearch?: (value: string) => void,
    onChange?: (value: string) => void,
    getType?: (value: number) => void,
}

export const GuardianDetails = ({data, value, fetching, onSearch, onChange, getType}: GuardianDetailsProps) => {

    const [searchType, setSearchType] = useState<SearchType>(SearchType.CLASSIC)
    const filterOption = (input: string, option?: { label: string; value: string }) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const options = useMemo(() => data?.map(d => ({
        value: d.value as string,
        label: d.text,
    })), [data])

    const handleSearch = (e: RadioChangeEvent) => {
        setSearchType(e.target.value)
        getType?.(e.target.value)
    }

    return(
        <>
            <Form>
                <Form.Item>
                    <Radio.Group
                        value={searchType}
                        onChange={handleSearch}
                        optionType='button'
                        buttonStyle='solid'
                        block
                        options={[
                            {value: SearchType.CLASSIC, label: 'Recherche classique'},
                            {value: SearchType.GLOBAL, label: 'Recherche Globale'}
                        ]}
                    />
                </Form.Item>
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