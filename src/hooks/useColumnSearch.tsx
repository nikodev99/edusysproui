import { useRef, useState } from "react";
import { FilterDropdownProps } from "antd/es/table/interface";
import { Button, Input, InputRef, Space, TableColumnType } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import Highlighter from "react-highlight-words";
import {DataIndex} from "../core/utils/interfaces.ts";

// utilitaire pour obtenir la valeur imbriquée selon dataIndex:
// record: objet d’une ligne, index de la donnée : clé simple ou tableau de clés.
function getNestedValue<TData extends object>(record: TData, dataIndex: DataIndex<TData> | DataIndex<TData>[]): unknown | undefined{
    if (!record || dataIndex == null) return undefined;

    if (Array.isArray(dataIndex)) {
        return dataIndex?.reduce((prev: TData, key: keyof TData): never => {
            if (prev == null) return undefined as unknown as never;
            return prev[key] as never;
        }, record);
    }
    return record[dataIndex];
}

export const useColumnSearch = <TData extends object,>() => {
    const [searchText, setSearchText] = useState<string>('');
    const [searchedColumn, setSearchedColumn] = useState<string>('');
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndexKey: string
    ) => {
        confirm();
        setSearchText(selectedKeys[0] || '');
        setSearchedColumn(dataIndexKey);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (
        dataIndex: DataIndex<TData>
    ): TableColumnType<TData> => {
        // Normaliser un identifiant unique de colonne pour comparer searchedColumn
        const dataIndexKey = Array.isArray(dataIndex)
            ? dataIndex.join('.')
            : (dataIndex as string);

        return {
            // Composant du filtre
            filterDropdown: ({ setSelectedKeys, selectedKeys = [], confirm, clearFilters, close }) => (
                <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
                    <Input
                        ref={searchInput}
                        placeholder={`Recherche ${dataIndexKey}`}
                        value={selectedKeys[0]}
                        onChange={e =>
                            setSelectedKeys(e.target.value ? [e.target.value] : [])
                        }
                        onPressEnter={() =>
                            handleSearch(selectedKeys as string[], confirm, dataIndexKey)
                        }
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() =>
                                handleSearch(selectedKeys as string[], confirm, dataIndexKey)
                            }
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
                                setSearchText((selectedKeys as string[])[0] || '');
                                setSearchedColumn(dataIndexKey);
                            }}
                        >
                            Filtrer
                        </Button>
                        <Button type="link" size="small" onClick={() => close()}>
                            Fermer
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered: boolean) => (
                <AiOutlineSearch style={{ color: filtered ? '#1677ff' : undefined }} />
            ),
            onFilter: (value, record: TData) => {
                const val = getNestedValue(record, dataIndex);
                if (val == null) return false;
                return val
                    .toString()
                    .toLowerCase()
                    .includes((value as string).toLowerCase());
            },
            filterDropdownProps: {
                onOpenChange: (visible) => {
                    if (visible) {
                        // petit délai pour s'assurer que le champ est monté
                        setTimeout(() => searchInput.current?.select(), 100);
                    }
                }
            },
            render: (_text, record) => {
                // On récupère la valeur imbriquée pour le rendu/Highlighter
                const cellValue = getNestedValue(record, dataIndex);
                const cellText = cellValue != null ? cellValue.toString() : '';
                if (searchedColumn === dataIndexKey && searchText) {
                    return (
                        <Highlighter
                            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                            searchWords={[searchText]}
                            autoEscape
                            textToHighlight={cellText}
                        />
                    );
                }
                // Par défaut, on renvoie le texte brut (ou on peut renvoyer text si on est sûr).
                return cellText;
            }
        };
    };

    return { getColumnSearchProps, searchText, searchedColumn };
};
