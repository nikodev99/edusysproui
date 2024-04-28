import './App.scss'
import {metadata} from "./utils/metadata.ts";
import {Layout} from "antd";
import Sidebar from "./components/sidebar/Sidebar.tsx";
import Header from "./components/header/Header.tsx";
import {useState} from "react";

metadata({
    title: "Dashboard",
    description: "New Home Page"
});

const App = () => {

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const handleCollapse = () => {
        setSidebarCollapsed(!sidebarCollapsed)
    }

    console.log(sidebarCollapsed)

    return(
        <Layout className="App">
            <Sidebar onCollapsed={sidebarCollapsed} />
            <Layout>
                <Header onCollapsed={handleCollapse} />
                <Layout.Content className='content'>

                </Layout.Content>
            </Layout>
        </Layout>
    )
}

export default App
