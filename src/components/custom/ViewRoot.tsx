import {Skeleton, Tabs, TabsProps} from "antd";
import {TabItemType} from "../../utils/interfaces.ts";
import {cloneElement, ReactElement, ReactNode, useState} from "react";
import LocalStorageManager from "../../core/LocalStorageManager.ts";

interface ViewProps {
    items: TabItemType[]
    exists: boolean
    tab?: TabsProps
    skeleton?: ReactNode
    isLoading?: boolean
}

const ViewRoot = ({items, tab, exists, isLoading, skeleton}: ViewProps) => {

    const activeTabKey = LocalStorageManager.get("tabKey") as string || "0"
    const [tabKey, setTabKey] = useState<string>(activeTabKey)

    const loadingSkeleton = skeleton ?? <Skeleton loading={isLoading} active={isLoading} paragraph={{rows: 5}} />

    const handleTabChange = (activeKey: string) => {
        setTabKey(activeKey)
        LocalStorageManager.update('tabKey', () => activeKey)
    }

    const tabItem: TabsProps['items'] = items.map((item: TabItemType, index: number) => ({
        key: index.toString(),
        label: item.label,
        children: exists ? cloneElement(item.children as ReactElement, {
            seeMore: handleTabChange,
            setActiveKey: handleTabChange
        })  : loadingSkeleton,
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
                onChange={handleTabChange}
                activeKey={tabKey}
                defaultActiveKey={tabKey}
                {...tab}
            />
        </section>
    )
}

export  { ViewRoot }