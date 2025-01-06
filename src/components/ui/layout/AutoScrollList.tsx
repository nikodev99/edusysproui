import InfiniteScroll from "react-infinite-scroll-component";
import {List, ListProps, Skeleton} from "antd";
import {useCallback, useEffect, useRef} from "react";

interface AutoScrollListProps<T> {
    listProps: ListProps<T>
    isLoading: boolean
    allItems: number
    loadMore: () => void
    size: number
    height?: number
    infinite?: boolean
}

export const AutoScrollList = <T extends object>(
    {listProps, isLoading, allItems, loadMore, size, height, infinite}: AutoScrollListProps<T>
) => {

    const isInfinite = useRef<boolean>(infinite ?? true)

    const handleLoadMore = useCallback(() => {
        if (!isLoading && size < allItems && isInfinite.current) {
            loadMore();
        }
    }, [isLoading, size, allItems, loadMore]);

    useEffect(() => {
        handleLoadMore()
    }, [])
    
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