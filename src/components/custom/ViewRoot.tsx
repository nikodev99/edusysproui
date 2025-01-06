import {Skeleton, Tabs, TabsProps} from "antd";
import {TabItemType} from "../../utils/interfaces.ts";
import {cloneElement, ReactElement, ReactNode, useState} from "react";
import LocalStorageManager from "../../core/LocalStorageManager.ts";
import {firstLetter} from "../../utils/utils.ts";
import StickyBox from "react-sticky-box";

interface ViewProps {
    items: TabItemType[]
    exists: boolean
    tab?: TabsProps
    skeleton?: ReactNode
    isLoading?: boolean
    addMargin?: {
        position?: "top" | "bottom" | "left" | "right",
        size?: number
    }
    memorizedTabKey?: string
}

const ViewRoot = ({items, tab, exists, isLoading, skeleton, addMargin, memorizedTabKey}: ViewProps) => {

    const activeTabKey = LocalStorageManager.get(memorizedTabKey ?? "tabKey") as string || "0"
    const [tabKey, setTabKey] = useState<string>(activeTabKey)

    const loadingSkeleton = skeleton ?? <Skeleton loading={isLoading} active={isLoading} paragraph={{rows: 5}} />

    const handleTabChange = (activeKey: string) => {
        setTabKey(activeKey)
        LocalStorageManager.update(memorizedTabKey ?? 'tabKey', () => activeKey)
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

    const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
        <StickyBox offsetTop={0} offsetBottom={0} style={{ zIndex: 10 }}>
            <DefaultTabBar {...props} style={{backgroundColor: '#f4f6fd'}} />
        </StickyBox>
    );

    return(
        <section className='sticky-wrapper' style={addMargin ? {
            [`margin${firstLetter(addMargin.position)}`]: addMargin.size
        } : undefined}>
            <Tabs
                renderTabBar={renderTabBar as TabsProps['renderTabBar']}
                items={tabItem}
                onChange={handleTabChange}
                activeKey={tabKey}
                defaultActiveKey={tabKey}
                centered={true}
                {...tab}
            />
        </section>
    )
}

export  { ViewRoot }