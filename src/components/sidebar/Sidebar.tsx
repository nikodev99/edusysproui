import "./sidebar.scss"
import {Flex, Menu, Image, Layout, Button} from "antd";
import {menuItems} from "../../utils/menuItems.tsx";
import {CircleChevronLeft, CircleChevronRight} from "lucide-react";
import {useToggle} from "../../hooks/useToggle.ts";
import {useNavigate} from "react-router-dom";

const Sidebar = ({onCollapsed}: {onCollapsed?: boolean}) => {

    const [collapsed, setCollapsed] = useToggle(false)
    const navigate = useNavigate();
    const handleMenuItemClick = ({key}: {key: string|null}) => {key ? navigate(key) : navigate('/')}

    return(
        <Layout.Sider theme="light" trigger={null} collapsed={collapsed} collapsible className={`sidebar ${onCollapsed ? "show" : ""}`} width={250}>
            <Flex align='center' justify='center' className='logo-wrapper'>
                <div className="logo">
                    <Image src="/edusyspro.svg" alt="logo" preview={false} width={89} />
                    {collapsed ? '' : <p>EduSysPro</p>}
                </div>
            </Flex>
            <Menu
                onClick={handleMenuItemClick}
                mode="inline"
                defaultSelectedKeys={['/dashboard']}
                className={`menu ${collapsed ? 'show' : ''}`}
                items={menuItems} />
            <Button
                className='trigger-btn'
                type='text'
                icon={collapsed ? <CircleChevronRight /> : <CircleChevronLeft />}
                onClick={setCollapsed} />
        </Layout.Sider>
    )
}

export default Sidebar