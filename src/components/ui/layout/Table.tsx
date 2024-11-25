import {Table as AntTable, TableProps} from 'antd';
import {HTMLProps} from "react";

interface CustomTableProps {
    tableProps: TableProps,
    color?: string
}

export const Table = ({tableProps, color}: CustomTableProps) => {
    return(
        <AntTable
            {...tableProps}
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