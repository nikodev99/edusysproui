import InfiniteScroll from "react-infinite-scroll-component";
import {List, ListProps, Skeleton} from "antd";
import {useCallback, useEffect, useRef} from "react";
import {AutoScrollProps} from "../../../utils/interfaces.ts";

interface AutoScrollListProps<T> {
    listProps: ListProps<T>
}

type AutoListProps<T> = AutoScrollListProps<T> & AutoScrollProps

export const AutoScrollList = <T extends object>(
    {listProps, isLoading, allItems, loadMoreSize, size, height, infinite}: AutoListProps<T>
) => {

    const isInfinite = useRef<boolean>(infinite ?? true)

    const handleLoadMore = useCallback(() => {
        if (!isLoading && size < allItems && isInfinite.current) {
            loadMoreSize();
        }
    }, [isLoading, size, allItems, loadMoreSize]);

    useEffect(() => {
        if (size)
            handleLoadMore()
    }, [size])
    
    return(
        <div id='autoScroll' style={{height: height ?? 500, overflow: 'auto', padding: '0 16px'}}>
            {isInfinite.current ? (
                <InfiniteScroll
                    next={handleLoadMore}
                    hasMore={size <= allItems}
                    loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                    dataLength={allItems}
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