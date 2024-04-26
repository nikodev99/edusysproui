import "./sidebar.scss"
import {Flex, Menu, Image, Layout, Button} from "antd";
import {menuItems} from "../../utils/menuItems.tsx";
import {CircleChevronLeft, CircleChevronRight} from "lucide-react";
import {useState} from "react";

const Sidebar = () => {

    const [collapsed, setCollapsed] = useState(false)
    const handleCollapse = () => {
        setCollapsed(!collapsed)
    }

    return(
        <Layout.Sider theme="light" trigger={null} collapsed={collapsed} collapsible className='sidebar'>
            <Flex align='center' justify='center'>
                <div className="logo">
                    <Image src="/edusyspro.svg" alt="logo" preview={false} />
                    {collapsed ? '' : <p>EduSysPro</p>}
                </div>
            </Flex>
            <Menu
                mode="vertical"
                defaultSelectedKeys={['1']}
                className={`menu ${collapsed ? 'show' : ''}`}
                items={menuItems} />
            <Button
                className='trigger-btn'
                type='text'
                icon={collapsed ? <CircleChevronRight /> : <CircleChevronLeft />}
                onClick={handleCollapse} />
        </Layout.Sider>
    )
}

export default Sidebar