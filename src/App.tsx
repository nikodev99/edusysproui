import './App.scss'
import {metadata} from "./utils/metadata.ts";
import {Button, Layout} from "antd";
import {useState} from "react";
import Sidebar from "./components/sidebar/Sidebar.tsx";
import CustomHeader from "./components/header/Header.tsx";
import {CircleChevronLeft, CircleChevronRight} from "lucide-react";

metadata({
    title: "Dashboard",
    description: "New Home Page"
});

const App = () => {

    const { Header, Sider, Content } = Layout;

    const [collapsed, setCollapsed] = useState(false)
    const handleCollapse = () => {
        setCollapsed(!collapsed)
    }
    
    return(
        <Layout className="App">
            <Sider theme="light" trigger={null} collapsed={collapsed} collapsible className='sidebar'>
                <Sidebar showText={collapsed} />
                <Button
                    className='trigger-btn'
                    type='text'
                    icon={collapsed ? <CircleChevronRight /> : <CircleChevronLeft />}
                    onClick={handleCollapse} />
            </Sider>
            <Layout>
                <Header className='header'>
                    <CustomHeader />
                </Header>
                <Content className='content'>

                </Content>
            </Layout>
        </Layout>
    )
}

export default App
