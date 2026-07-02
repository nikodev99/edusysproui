import {Pagination as AntPagination} from "antd";
import {useState} from "react";

export const Pagination = (
    {size, getSize, disabled = false, current, dataCount, isResponsive = true, getPage, getCurrentPage}: {
        size: number,
        current?: number,
        dataCount: number,
        getSize?: (value: number) => void,
        getPage?: (value: number) => void,
        getCurrentPage?: (value: number) => void,
        disabled?: boolean
        isResponsive?: boolean
    }) => {
    const [currentPage, setCurrentPage] = useState<number>(current ?? 1)

    const handleSizeChange = (current: number, pageSize: number) => {
        setCurrentPage(current)
        getCurrentPage?.(current)
        getSize?.(pageSize)
    }

    const handleNavChange = (page: number, pageSize: number) => {
        getPage?.(page - 1)
        getSize?.(pageSize)
        setCurrentPage(page)
        getCurrentPage?.(page)
    }

    return(
        <AntPagination
            current={currentPage}
            defaultCurrent={1}
            total={dataCount}
            pageSize={size}
            responsive={isResponsive}
            onShowSizeChange={handleSizeChange}
            onChange={handleNavChange}
            disabled={disabled}
        />
    )
}