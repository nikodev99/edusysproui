import './App.scss'
import {metadata} from "./utils/metadata.ts";
import {Layout} from "antd";
import Sidebar from "./components/sidebar/Sidebar.tsx";
import Header from "./components/header/Header.tsx";
import {useToggle} from "./hooks/useToggle.ts";

metadata({
    title: "Dashboard",
    description: "New Home Page"
});

const App = () => {

    const [sidebarCollapsed, setSidebarCollapsed] = useToggle(false)

    console.log(sidebarCollapsed)

    return(
        <Layout className="App">
            <Sidebar onCollapsed={sidebarCollapsed} />
            <Layout>
                <Header onCollapsed={setSidebarCollapsed} />
                <Layout.Content className='content'>

                </Layout.Content>
            </Layout>
        </Layout>
    )
}

export default App
