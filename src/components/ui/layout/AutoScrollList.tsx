import InfiniteScroll from "react-infinite-scroll-component";
import {List, ListProps, Skeleton} from "antd";
import {useCallback, useEffect, useRef, useState} from "react";
import {AutoScrollProps} from "../../../utils/interfaces.ts";

interface AutoScrollListProps<T> {
    listProps: ListProps<T>
}

type AutoListProps<T> = AutoScrollListProps<T> & AutoScrollProps

export const AutoScrollList = <T extends object>(
    {listProps, isLoading, allItems, loadMoreSize, size, height, infinite, seconds}: AutoListProps<T>
) => {

    const [wait, setWait] = useState<boolean>(false)
    const isInfinite = useRef<boolean>(infinite ?? true)

    const handleLoadMore = useCallback(() => {
        if (!isLoading && (size < allItems) && isInfinite.current) {
            setWait(true)
            setTimeout(() => {
                setWait(false)
                loadMoreSize()
            }, seconds ?? 1000, [])
        }
    }, [isLoading, size, allItems, seconds, loadMoreSize]);

    useEffect(() => {
        if (size && size < allItems)
            handleLoadMore()
    }, [])
    
    return(
        <div id='autoScroll' style={{height: height ?? 500, overflowY: 'auto', padding: '0 16px'}}>
            {isInfinite.current ? (
                <InfiniteScroll
                    next={handleLoadMore}
                    hasMore={size < allItems}
                    loader={(wait || isLoading) ? <Skeleton avatar paragraph={{ rows: 1 }} active />: undefined}
                    dataLength={size}
                    endMessage={allItems > 50 ? <div style={{textAlign: "center"}}>
                        <small>No more data</small>
                    </div> : ''}
                    scrollableTarget='autoScroll'
                >
                    <List {...listProps} />
                </InfiniteScroll>
            ): (<List {...listProps} />)}

        </div>
    )
}