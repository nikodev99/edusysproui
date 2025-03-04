import {Tabs} from "antd";
import PageWrapper from "./PageWrapper.tsx";
import {ReactNode} from "react";


interface TabItemProps {
    title: string | ReactNode;
    selects?: ReactNode[]
    items?: { key: string; label: ReactNode, children?: ReactNode }[]
    onTabChange?: (tabKey: string) => void,
    tabClassName?: string
}

const TabItem = ({title, selects, items, onTabChange, tabClassName}: TabItemProps) => {

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
                            <Tabs
                                className={tabClassName}
                                centered size='small'
                                items={items}
                                onChange={onTabChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}

export default TabItem