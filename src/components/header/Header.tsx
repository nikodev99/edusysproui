import "./header.scss"
import {Avatar, Flex, Typography} from "antd";
import Search from "antd/es/input/Search";
import {Bell, MessageSquare, User} from "lucide-react";


const CustomHeader = () => {
    return(
        <Flex align='center' justify='space-between'>
            <Typography.Title level={5} type='secondary' className='welcome-message'>
                Welcome Back, Nikhe
            </Typography.Title>
            <Flex align='center' gap='3rem'>
                <Search placeholder='Search...'  allowClear className='search-input' />
                <Flex align='center' gap='10px'>
                    <MessageSquare className='header-icon'/>
                    <Bell className='header-icon'/>
                    <Avatar shape={"square"} icon={<User />} />
                </Flex>
            </Flex>
        </Flex>
    )
}

export default CustomHeader