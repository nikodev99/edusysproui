import {Tabs, TabsProps} from "antd";
import PageWrapper from "./PageWrapper.tsx";
import {ReactNode} from "react";
import {StickyTabs} from "../ui/layout/StickyTabs.tsx";


interface TabItemProps {
    title: string | ReactNode;
    selects?: ReactNode[]
    items?: { key: string; label: ReactNode, children?: ReactNode }[]
    onTabChange?: (tabKey: string) => void,
    tabClassName?: string,
    stickTab?: boolean
    tabsProps?: TabsProps
}

const TabItem = ({title, selects, items, onTabChange, tabClassName, stickTab = false, tabsProps}: TabItemProps) => {

    return (
        <PageWrapper classNameList='item'>
            <div className='item-section-container'>
                <div className='full__name'>
                    <h1>{title}</h1>
                </div>
                <div className="scores">
                    <div className="pl-scores">
                        <div className="head">
                            {selects && <div className="multi-head-select">
                                {selects?.map((select, index) => (
                                    <div className="head-select" key={`item-${index}`}>
                                        {select}
                                    </div>
                                ))}
                            </div>}
                            {
                                stickTab
                                    ? (
                                        <StickyTabs
                                            {...tabsProps}
                                            className={tabClassName}
                                            centered size='small'
                                            items={items}
                                            onChange={onTabChange}
                                        />
                                    )
                                    : (
                                        <Tabs
                                            {...tabsProps}
                                            className={tabClassName}
                                            centered size='small'
                                            items={items}
                                            onChange={onTabChange}
                                        />
                                    )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}

export default TabItem