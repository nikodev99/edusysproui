import "./page.scss"
import Sidebar from "../components/sidebar/Sidebar.tsx";
import {Layout} from "antd";
import Header from "../components/header/Header.tsx";
import {useToggle} from "../hooks/useToggle.ts";
import {Navigate, Outlet, useLocation} from "react-router-dom";

const PageLayout = () => {

    const [sidebarCollapsed, setSidebarCollapsed] = useToggle(false)

    return(
        <Layout className="App">
            <Sidebar onCollapsed={sidebarCollapsed} />
            <Layout>
                <Header onCollapsed={setSidebarCollapsed} />
                <Layout.Content className="container">
                    <ParentComponent />
                </Layout.Content>
            </Layout>
        </Layout>
    )
}

const ParentComponent = () => {
    const location = useLocation();

    // If this is the exact parent route, redirect to /home
    if (location.pathname === '/parent-path') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default PageLayout;