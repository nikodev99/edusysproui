import {Button, List, ListProps} from "antd";
import {ButtonType} from "antd/es/button";
import {ReactNode} from "react";

interface LoadMoreListProps<T> {
    listProps: ListProps<T>
    isLoading: boolean,
    size: number,
    allItems: number,
    onLoadMore: () => void
    buttonType?: ButtonType
    buttonLabel?: ReactNode
}

export const LoadMoreList = <T extends object>(
    {listProps, isLoading, size, allItems, onLoadMore, buttonType, buttonLabel}: LoadMoreListProps<T>
) => {

    const handleLoadMore = () => {
        onLoadMore();
    }

    const loadMore =
        !isLoading ? (
            <div style={{
                textAlign: 'center',
                marginTop: 12,
                height: 32,
                lineHeight: '32px',
            }}>
                <Button
                    type={buttonType ?? 'dashed'}
                    disabled={size >= allItems}
                    onClick={handleLoadMore}
                    loading={isLoading}
                >
                    {`${buttonLabel ? buttonLabel : 'Charger plus'}`}
                </Button>
            </div>
        ) : null;

    return(
        <List
            {...listProps}
            loadMore={loadMore}
        />
    )
}