import './App.scss'
import {metadata} from "./utils/metadata.tsx";
import {Layout} from "antd";
import {useState} from "react";
import Sidebar from "./components/Sidebar.tsx";

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
                <Sidebar />
            </Sider>
            <Layout>
                <Header className='header'>Here is the header</Header>
                <Content className='content'>Here is the content</Content>
            </Layout>
        </Layout>
    )
}

export default App
