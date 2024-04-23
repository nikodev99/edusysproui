import "./header.scss"
import {Badge, Flex, Typography} from "antd";
import Search from "antd/es/input/Search";
import {MessageSquare} from "lucide-react";
import ProfileCard from "../cards/ProfileCard.tsx";
import NotificationCard from "../cards/NotificationCard.tsx";


const CustomHeader = () => {
    return(
        <Flex align='center' justify='space-between'>
            <Typography.Title level={5} type='secondary' className='welcome-message'>
                Welcome Back, Nikhe
            </Typography.Title>
            <Flex align='center' gap='3rem'>
                <Search placeholder='Search...'  allowClear className='search-input' />
                <Flex align='center' gap='10px'>
                    <Badge dot>
                        <MessageSquare className='header-icon'/>
                    </Badge>
                    <NotificationCard />
                    < ProfileCard />
                </Flex>
            </Flex>
        </Flex>
    )
}

export default CustomHeader