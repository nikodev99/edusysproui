import {Select, Space} from "antd";
import {ActionButton} from "../ui/layout/ActionButton.tsx";
import {LuCirclePlus, LuCircleX} from "react-icons/lu";
import {ItemType} from "antd/es/menu/interface";
import {useEffect, useState} from "react";

export interface FilterProps<T extends object> {
    filters: T
    items?: ItemType[]
    options?: Record<keyof T, {label: string, value: unknown}[]>
    onClear?: (key: keyof T) => void
    setFilters?: (filters: T) => void
    onChanges?: Record<keyof T, (value: unknown) => void>
}

export const Filter = <T extends object>({filters, items = [], onClear, setFilters, options, onChanges}: FilterProps<T>) => {

    const [filterItems, setFilterItems] = useState<T>(filters as T)
    const [keys, setKeys] = useState<(keyof T)[]>([])

    useEffect(() => {
        if (filters) {
            setFilterItems(filters);
            setKeys(Object.keys(filters) as (keyof T)[]);
        }
    }, [filters])


    const handleClear = (key: keyof T) => {
        // Call the parent's onClear if provided (for notification purposes)
        if (onClear) {
            onClear?.(key)
        }else {
            // Remove the key from the key array
            setKeys(keys.filter(k => k !== key))

            // Remove the property from the filterItems object using destructuring
            const newFilterItems = {...filterItems};
            delete newFilterItems[key];
            setFilterItems(newFilterItems as T)
            setFilters?.(newFilterItems as T)
        }
    }

    console.log('FILTER DANS FILTER: ', filterItems)

    return(
        <Space wrap>
            {keys?.map((key, i) => (
                <Select
                    key={key as string}
                    allowClear={i > 0 ? {clearIcon: <LuCircleX style={{color: "red"}} />} : undefined}
                    onClear={i > 0 ? () => handleClear(key as keyof T) : undefined}
                    value={filterItems[key] ?? undefined}
                    variant='borderless'
                    options={options ? options[key] : undefined}
                    style={{width: '150px'}}
                    onChange={(value) => {
                        if (value === undefined) {
                            handleClear(key);
                        } else {
                            onChanges?.[key]?.(value);
                        }
                    }}
                />
            ))}
            <ActionButton icon={<LuCirclePlus size={20} />} className='filter_action' items={[
                {key: '0', label: 'filtrer par', disabled: true},
                {type: 'divider'},
                ...items
            ]} />
        </Space>
    )
}