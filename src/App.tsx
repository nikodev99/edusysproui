import './App.scss'
import {metadata} from "./utils/metadata.ts";
import {Button, Layout} from "antd";
import {useState} from "react";
import Sidebar from "./components/sidebar/Sidebar.tsx";
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
            <Sider style={{width: '300px'}} theme="light" trigger={null} collapsed={collapsed} collapsible className='sidebar'>
                <Sidebar showText={collapsed} />
                <Button
                    className='trigger-btn'
                    type='text'
                    icon={collapsed ? <CircleChevronRight /> : <CircleChevronLeft />}
                    onClick={handleCollapse} />
            </Sider>
            <Layout>
                <Header className='header'>Here is the header</Header>
                <Content className='content'>Here is the content</Content>
            </Layout>
        </Layout>
    )
}

export default App
