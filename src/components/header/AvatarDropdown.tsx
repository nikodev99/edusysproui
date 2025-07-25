import {Alert, Button, Divider, Dropdown, MenuProps} from "antd";
import {LuCog, LuLogOut, LuShoppingCart, LuUser} from "react-icons/lu";
import {firstWord, getSlug} from "../../core/utils/utils.ts";
import {useAuth} from "../../hooks/useAuth.ts";
import {useRedirect} from "../../hooks/useRedirect.ts";
import {Individual} from "../../entity";
import {UserType} from "../../auth/dto/user.ts";

const AvatarDropdown = () => {

    const {user, logoutUser} = useAuth()
    const {toViewEmployee, toViewTeacher, toViewGuardian} = useRedirect()

    const redirectToProfile = () => {
        const userSlug = getSlug({firstName: user?.firstName, lastName: user?.lastName} as Individual)
        switch (user?.userType) {
            case UserType.TEACHER:
                return toViewTeacher(user?.userId as string)
            case UserType.GUARDIAN:
                return toViewGuardian(user?.userId as string)
            case UserType.EMPLOYEE:
                return toViewEmployee(user?.userId, userSlug)
            default:
                alert('Profile Inexistant')
        }
    }

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: <span>Profile</span>,
            icon: <LuUser />,
            onClick: redirectToProfile
        },
        {
            key: '2',
            label: 'Payements',
            icon: <LuShoppingCart />
        },
        {
            key: '3',
            label: 'Paramètres',
            icon: <LuCog />
        },
        {
            key: '4',
            label: 'Déconnexion',
            icon: <LuLogOut />,
            onClick: handleLogout,
        }
    ]

    function handleLogout() {
        logoutUser()
    }

    console.log(user)

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
                <Button icon={<LuLogOut  size={15}/>} onClick={handleLogout}>Déconnexion</Button>
            </div>
        </div>
    )
}

export default AvatarDropdown