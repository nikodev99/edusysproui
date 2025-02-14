import {Table as AntTable, TableProps} from 'antd';
import {HTMLProps} from "react";

export interface CustomTableProps<RecordType> {
    tableProps: TableProps<RecordType>,
    color?: string
}

export const Table = <T extends object>({tableProps, color}: CustomTableProps<T>) => {
    return(
        <AntTable
            {...tableProps}
            className='ui__table'
            components={
                color ? {
                    header: {
                        cell: (props: HTMLProps<HTMLTableCellElement>) => (
                            <th {...props} style={{ ...props.style, backgroundColor: color }} />
                        )
                    }
                } : undefined
            }
        />
    )
}