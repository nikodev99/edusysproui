import {Tabs} from "antd";
import PageWrapper from "../ui/layout/PageWrapper.tsx";
import {ReactNode} from "react";


interface TabItemProps {
    title: string
    selects?: ReactNode[]
    items?: { key: string; label: ReactNode, children?: ReactNode }[]
}

const TabItem = ({title, selects, items}: TabItemProps) => {

    return (
        <PageWrapper classNameList='item'>
            <div className='item-section-container'>
                <div className='full__name'>
                    <h1>{title}</h1>
                </div>
                <div className="scores">
                    <div className="pl-scores">
                        <div className="head">
                            <div className="multi-head-select">
                                {selects?.map((select, index) => (
                                    <div className="head-select" key={`item-${index}`}>
                                        {select}
                                    </div>
                                ))}
                            </div>
                            <Tabs centered size='small' items={items} />
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}

export default TabItem