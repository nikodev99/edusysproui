import "./sidebar.scss"
import {Flex, Menu, Image, Layout, Button} from "antd";
import {menuItems} from "../../core/menuItems.tsx";
import {useToggle} from "../../hooks/useToggle.ts";
import {LuChevronLeft, LuChevronRight} from "react-icons/lu";
import {redirectTo} from "../../context/RedirectContext.ts";

const Sidebar = ({onCollapsed}: {onCollapsed?: boolean}) => {

    const [collapsed, setCollapsed] = useToggle(false)
    const handleMenuItemClick = ({key}: {key: string|null}) => {key ? redirectTo(key) : redirectTo('/')}

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
                className={`menu ${collapsed ? 'show' : ''}`}
                items={menuItems} />
            <Button
                className='trigger-btn'
                type='text'
                icon={collapsed ? <LuChevronRight /> : <LuChevronLeft />}
                onClick={setCollapsed} />
        </Layout.Sider>
    )
}

export default Sidebar