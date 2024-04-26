import "./header.scss"
import {Avatar, Badge, Dropdown, Flex, Layout, Typography} from "antd";
import Search from "antd/es/input/Search";
import {Bell, User} from "lucide-react";
import AvatarDropdown from "./AvatarDropdown.tsx";
import NotificationDropdown from "./NotificationDropdown.tsx";


const Header = () => {
    return(
        <Layout.Header className='header'>
            <Flex align='center' justify='space-between'>
                <Typography.Title level={5} type='secondary' className='welcome-message'>
                    Welcome Back, Nikhe
                </Typography.Title>
                <Flex align='center' gap='3rem'>
                    <Search placeholder='Search...'  allowClear className='search-input' />
                    <Flex align='center' gap='10px'>
                        <Dropdown dropdownRender={() => (<NotificationDropdown />)}>
                            <Badge dot>
                                <Bell className='header-icon'/>
                            </Badge>
                        </Dropdown>
                        <Dropdown dropdownRender={() => (<AvatarDropdown />)} trigger={['click']} arrow={{pointAtCenter: true}}>
                            <Avatar shape={"square"} icon={<User/>} className="avatar"/>
                        </Dropdown>
                    </Flex>
                </Flex>
            </Flex>
        </Layout.Header>

    )
}

export default Header