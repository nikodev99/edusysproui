import "./sidebar.scss"
import {Flex, Menu, Image} from "antd";
import {menuItems} from "../../utils/menuItems.tsx";

const Sidebar = ({showText}: {showText: boolean}) => {
    return(
        <>
            <Flex align='center' justify='center'>
                <div className="logo">
                    <Image src="/edusyspro.svg" alt="logo" preview={false} />
                    {showText ? '' : <p>EduSysPro</p>}
                </div>
            </Flex>
            <Menu
                mode="vertical"
                defaultSelectedKeys={['1']}
                className={`menu ${showText ? 'show' : ''}`}
                items={menuItems} />
        </>
    )
}

export default Sidebar;