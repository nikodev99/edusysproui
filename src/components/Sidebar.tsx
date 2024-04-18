import {Flex, Menu, Image} from "antd";

const Sidebar = () => {
    return(
        <>
            <Flex align='center' justify='center'>
                <div className="logo">
                    <Image src="/edusyspro.svg" alt="logo" />
                    <p>EduSysPro</p>
                </div>
            </Flex>
            <Menu mode="horizontal" defaultSelectedKeys={['1']} className="menu" />
        </>
    )
}

export default Sidebar;