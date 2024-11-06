import {Skeleton, Tabs, TabsProps} from "antd";
import {TabItemType} from "../../utils/interfaces.ts";
import {ReactNode} from "react";

interface ViewProps {
    items: TabItemType[]
    exists: boolean
    tab: TabsProps
    skeleton?: ReactNode
    isLoading?: boolean
}

const ViewRoot = ({items, tab, exists, isLoading, skeleton}: ViewProps) => {

    const loadingSkeleton = skeleton ?? <Skeleton loading={isLoading} active={isLoading} paragraph={{rows: 5}} />

    const tabItem: TabsProps['items'] = items.map((item: TabItemType, index: number) => ({
        key: index.toString(),
        label: item.label,
        children: exists ? item.children : loadingSkeleton,
        closeIcon: item.closeIcon,
        destroyInactiveTabPane: item.destroyInactiveTabPane ?? false,
        disabled: item.disabled ?? false,
        forceRender: item.forceRender ?? false,
        icon: item.icon,
        closable: item.closable ?? false,
    }))

    return(
        <section className='sticky-wrapper'>
            <Tabs
                items={tabItem}
                {...tab}
            />
        </section>
    )
}

export  { ViewRoot }