import {Alert, Button, Divider, Dropdown, MenuProps} from "antd";
import {LuCog, LuLogOut, LuShoppingCart, LuUser} from "react-icons/lu";
import {firstWord} from "../../core/utils/utils.ts";
import {useAuth} from "../../hooks/useAuth.ts";

const AvatarDropdown = () => {

    const {user, logoutUser} = useAuth()

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="#">
                    Profile
                </a>
            ),
            icon: <LuUser />
        },
        {
            key: '2',
            label: (
                <a rel="noopener noreferrer" href="#">
                    To be paid
                </a>
            ),
            icon: <LuShoppingCart />
        },
        {
            key: '3',
            label: (
                <a rel="noopener noreferrer" href="#">
                    Settings
                </a>
            ),
            icon: <LuCog />
        },
        {
            key: '4',
            label: (
                <a rel="noopener noreferrer" href="#">
                    Logout
                </a>
            ),
            icon: <LuLogOut />
        }
    ]

    function handleLogout() {
        logoutUser()
    }

    return(
        <div className="avatar-dropdown">
            <div className="avatar-dropdown--title">
                <h2 className='avatar-image'>
                    <span>{`${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`}</span>
                </h2>
                <div className='avatar-profile'>
                    <p>{`${firstWord(user?.lastName)} ${firstWord(user?.firstName)}`}</p>
                    <p>{`${user?.email || user?.username || user?.phoneNumber}`}</p>
                    <div className="account-dropdown">
                        <Dropdown menu={{items}} trigger={['click']}>
                            <Alert message="Manage your profile" type='info' style={{cursor: 'pointer'}} className="alert"></Alert>
                        </Dropdown>
                    </div>
                </div>
            </div>
            <Divider/>
            <div className='avatar-btn--logout'>
                <Button icon={<LuLogOut  size={15}/>} onClick={handleLogout}>Logout</Button>
            </div>
        </div>
    )
}

export default AvatarDropdown