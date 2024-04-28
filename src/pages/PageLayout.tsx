import Sidebar from "../components/sidebar/Sidebar.tsx";
import {Layout} from "antd";
import Header from "../components/header/Header.tsx";
import {useToggle} from "../hooks/useToggle.ts";
import {Outlet} from "react-router-dom";

const PageLayout = () => {

    const [sidebarCollapsed, setSidebarCollapsed] = useToggle(false)

    return(
        <Layout className="App">
            <Sidebar onCollapsed={sidebarCollapsed} />
            <Layout>
                <Header onCollapsed={setSidebarCollapsed} />
                <Outlet />
            </Layout>
        </Layout>
    )
}

export default PageLayout;