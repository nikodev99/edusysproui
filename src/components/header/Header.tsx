import "./header.scss"
import {Avatar, Badge, Dropdown, Flex, Layout, Typography} from "antd";
import Search from "antd/es/input/Search";
import AvatarDropdown from "./AvatarDropdown.tsx";
import NotificationDropdown from "./NotificationDropdown.tsx";
import {LuBell, LuMenu, LuUser} from "react-icons/lu";
import {useAcademicYearRepo} from "../../hooks/actions/useAcademicYearRepo.ts";


const Header = ({onCollapsed}: {onCollapsed: () => void}) => {

    const {useGetCurrentAcademicYear} = useAcademicYearRepo()
    const academicYear = useGetCurrentAcademicYear()

    return(
        <Layout.Header className='header'>
            <Flex align='center' justify='space-between'>
                <div className='hamburger'>
                    <LuMenu onClick={onCollapsed}/>
                </div>
                <Flex align='center' vertical>
                    <Typography.Text type='secondary' className='welcome-message'>
                        Année académique
                    </Typography.Text>
                    <Typography.Text type='secondary' className='welcome-message'>
                        {academicYear?.academicYear}
                    </Typography.Text>
                </Flex>

                <Flex align='center' style={{width: '600px'}}>
                    <Search placeholder='Search...' allowClear className='search-input' size='large' variant='filled' />
                </Flex>
                <Flex align='center' gap='3rem'>
                    <Flex align='center' gap='10px'>
                        <Dropdown dropdownRender={() => (<NotificationDropdown />)}>
                            <Badge dot>
                                <Avatar shape='square' icon={<LuBell />} className='header-icon' />
                            </Badge>
                        </Dropdown>
                        <Dropdown dropdownRender={() => (<AvatarDropdown />)} trigger={['click']} arrow={{pointAtCenter: true}}>
                            <Avatar shape={"square"} icon={<LuUser/>} className="avatar"/>
                        </Dropdown>
                    </Flex>
                </Flex>
            </Flex>
        </Layout.Header>

    )
}

export default Header