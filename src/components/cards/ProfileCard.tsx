import "./card.scss"
import {Alert, Avatar, Button, Divider, Dropdown, MenuProps} from "antd";
import {Cog, LogOut, ShoppingCart, User} from "lucide-react";

const ProfileCard = () => {

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="#">
                    Profile
                </a>
            ),
            icon: <User />
        },
        {
            key: '2',
            label: (
                <a rel="noopener noreferrer" href="#">
                    To be paid
                </a>
            ),
            icon: <ShoppingCart />,
        },
        {
            key: '3',
            label: (
                <a rel="noopener noreferrer" href="#">
                    settings
                </a>
            ),
            icon: <Cog />,
        }
    ]


    return(
        <Dropdown dropdownRender={() => (
            <div className="avatar-dropdown">
                <div className="avatar-dropdown--title">
                    <h2 className='avatar-image'>
                        <span>NN</span>
                    </h2>
                    <div className='avatar-profile'>
                        <p>Nikhe Niama</p>
                        <p>nikhe.niama99@gmail.com</p>
                        <p>
                            <Dropdown menu={{items}} trigger={['click']}>
                                <Alert message="Manage your profile" type='info' style={{cursor: 'pointer'}} className="alert"></Alert>
                            </Dropdown>
                        </p>
                    </div>
                </div>
                <Divider/>
                <div className='avatar-btn--logout'>
                    <Button icon={<LogOut  size={15}/>}>Logout</Button>
                </div>
            </div>
        )} trigger={["click"]} arrow={{pointAtCenter: true}}>
            <Avatar shape={"square"} icon={<User/>} className="avatar"/>
        </Dropdown>
    )
}

export default ProfileCard;