import {useRef, useState} from "react";
import {FilterDropdownProps} from "antd/es/table/interface";
import {Button, Input, InputRef, Space, TableColumnType} from "antd";
import {AiOutlineSearch} from "react-icons/ai";
import Highlighter from "react-highlight-words";
import {DataIndex, DataType} from "../utils/interfaces.ts";

export const useColumnSearch = <TData,>() => {
    const [searchText, setSearchText] = useState<string>('')
    const [searchedColumn, setSearchedColumn] = useState<string>('')
    const searchInput = useRef<InputRef>(null)

    const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps['confirm'], dataIndex: DataIndex<TData>,) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex as string)
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('')
    };

    const getColumnSearchProps = (dataIndex: DataIndex<TData>): TableColumnType<DataType<TData>> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Recherche ${dataIndex as string}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<AiOutlineSearch />}
                        size="small"
                        style={{ width: 90 }}
                    />
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Réinitialiser
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex as string);
                        }}
                    >
                        Filtrer
                    </Button>
                    <Button type="link" size="small" onClick={() => { close() }}>Fermer</Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <AiOutlineSearch style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]?.toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()) as boolean,
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    })

    return {getColumnSearchProps, searchText, searchedColumn}
}