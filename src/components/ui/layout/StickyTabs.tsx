import {Tabs, TabsProps} from "antd";
import StickyBox from "react-sticky-box";

export const StickyTabs = (tabProps: TabsProps) => {

    const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
        <StickyBox offsetTop={0} offsetBottom={0} style={{ zIndex: 10 }}>
            <DefaultTabBar {...props} style={{backgroundColor: '#f4f6fd'}} />
        </StickyBox>
    );

    return (
        <Tabs renderTabBar={renderTabBar} {...tabProps} />
    )
}