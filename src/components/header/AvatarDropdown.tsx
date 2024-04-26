import {Alert, Button, Divider, Dropdown, MenuProps} from "antd";
import {Cog, LogOut, ShoppingCart, User} from "lucide-react";

const AvatarDropdown = () => {

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
            icon: <ShoppingCart />
        },
        {
            key: '3',
            label: (
                <a rel="noopener noreferrer" href="#">
                    Settings
                </a>
            ),
            icon: <Cog />
        },
        {
            key: '4',
            label: (
                <a rel="noopener noreferrer" href="#">
                    Logout
                </a>
            ),
            icon: <LogOut />
        }
    ]


    return(
        <div className="avatar-dropdown">
            <div className="avatar-dropdown--title">
                <h2 className='avatar-image'>
                    <span>NN</span>
                </h2>
                <div className='avatar-profile'>
                    <p>Nikhe Niama</p>
                    <p>nikhe.niama99@gmail.com</p>
                    <div className="account-dropdown">
                        <Dropdown menu={{items}} trigger={['click']}>
                            <Alert message="Manage your profile" type='info' style={{cursor: 'pointer'}} className="alert"></Alert>
                        </Dropdown>
                    </div>
                </div>
            </div>
            <Divider/>
            <div className='avatar-btn--logout'>
                <Button icon={<LogOut  size={15}/>}>Logout</Button>
            </div>
        </div>
    )
}

export default AvatarDropdown