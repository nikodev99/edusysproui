import {Form, Select, SelectProps} from "antd";
import {useState} from "react";

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

const fetch = (value: string, callback: Function) => {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = value;

    const fake = () => {
        const str = qs.stringify({
            code: 'utf-8',
            q: value,
        });
        jsonp(`https://suggest.taobao.com/sug?${str}`)
            .then((response: any) => response.json())
            .then((d: any) => {
                if (currentValue === value) {
                    const { result } = d;
                    const data = result.map((item: any) => ({
                        value: item[0],
                        text: item[0],
                    }));
                    callback(data);
                }
            });
    };
    if (value) {
        timeout = setTimeout(fake, 300);
    } else {
        callback([]);
    }
};

const GuardianDetails = () => {

    const [data, setData] = useState<SelectProps['options']>([]);
    const [value, setValue] = useState<string>();

    const handleSearch = (newValue: string) => {
        fetch(newValue, setData);
    };

    const handleChange = (newValue: string) => {
        setValue(newValue);
    };

    return(
        <>
            <Form>
                <Form.Item label='Rechercher le tuteur'>
                    <Select
                        showSearch
                        value={value}
                        placeholder='Rechercher le tuteur'
                        defaultActiveFirstOption={false}
                        suffixIcon={null}
                        filterOption={false}
                        onSearch={handleSearch}
                        onChange={handleChange}
                        notFoundContent={null}
                        options={(data || []).map((d) => ({
                            value: d.value,
                            label: d.text,
                        }))}
                    />
                </Form.Item>
            </Form>
        </>
    )
}

export default GuardianDetails;