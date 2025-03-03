import {CustomTableProps, Table} from "./Table.tsx";
import {AutoScrollProps} from "../../../utils/interfaces.ts";
import {Spin} from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import {useCallback, useRef, useState} from "react";

type AutoScrollTableProps<TRecord> = CustomTableProps<TRecord> & AutoScrollProps

export const AutoScrollTable = <T extends object>(props: AutoScrollTableProps<T>) => {
    const {tableProps, color, loadMoreSize, size, allItems, height, isLoading, infinite, seconds} = props;

    const [wait, setWait] = useState<boolean>(false)
    const isInfinite = useRef<boolean>(infinite ?? true)

    const handleLoadMore = useCallback(() => {
        if (!isLoading && (size < allItems) && isInfinite.current) {
            setWait(true)
            setTimeout(() => {
                setWait(false)
                loadMoreSize()
            }, seconds ?? 1000)
        }
    }, [isLoading, size, allItems, seconds, loadMoreSize])

    return (
        <div id='tableAutoScroll' style={{ overflowY: "auto", height }}>
            <InfiniteScroll
                next={handleLoadMore}
                hasMore={size <= allItems}
                loader={(wait || isLoading) ? <Spin style={{display: 'block', textAlign: 'center', padding: '10px'}} /> : undefined}
                dataLength={size}
                endMessage={allItems > 100 ? <div style={{textAlign: "center"}}>
                    <small>No more data</small>
                </div> : ''}
                scrollableTarget='tableAutoScroll'
            >
                <Table
                    tableProps={tableProps}
                    color={color}
                />
            </InfiniteScroll>
        </div>
    )
}