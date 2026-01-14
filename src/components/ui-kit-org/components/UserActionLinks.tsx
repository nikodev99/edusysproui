import {ItemType} from "antd/es/menu/interface";
import {useMemo} from "react";
import {
    LuKeyRound,
    LuLock, LuLockKeyhole,
    LuLockOpen,
    LuSheet,
    LuToggleLeft,
    LuToggleRight,
    LuUserPen
} from "react-icons/lu";
import {AiOutlineUserDelete} from "react-icons/ai";
import {User} from "@/auth/dto/user.ts";
import {useToggle} from "@/hooks/useToggle.ts";
import {UserRoles} from "./UserRoles.tsx";
import {UserAccountEnabled} from "./UserAccountEnabled.tsx";
import {UserAccountLocked} from "./UserAccountLocked.tsx";
import {UserRemoveAccount} from "./UserRemoveAccount.tsx";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {getSlug} from "@/core/utils/utils.ts";
import {ResetPassword} from "./ResetPassword.tsx";
import {useUserRepo} from "@/hooks/actions/useUserRepo.ts";
import {ActionButtonsProps} from "@/core/utils/interfaces.ts";
import {useMenuItemsEffect} from "@/hooks/useMenuItemsEffect.ts";

export const UserActionLinks = ({data: user, getItems, setRefresh}: ActionButtonsProps<User>) => {
    const {toUserActivity, toChangePassword} = useRedirect()
    const [roleManage, setRoleManage] = useToggle(false)
    const [enable, setEnable] = useToggle(false)
    const [accountNoLocked, setAccountNoLocked] = useToggle(false)
    const [removeUser, setRemoveUser] = useToggle(false)
    const [passwordReset, setPasswordReset] = useToggle(false)
    const {isSameUser} = useUserRepo()

    const sameUser = useMemo(() => user ? isSameUser(user) : false, [isSameUser, user])
    
    const items: ItemType[] = useMemo(() => {
        return [
            {
                key: `account-${user?.id}`,
                icon: <LuUserPen />,
                label: 'Manager Roles',
                onClick: setRoleManage
            },
            {
                key: `activity-${user?.id}`,
                icon: <LuSheet />,
                label: 'Voir Activité',
                onClick: () => toUserActivity(user?.id as number, getSlug({firstName: user?.firstName, lastName: user?.lastName}))
            },
            { type: 'divider' },
            {
                key: `enable-${user?.id}`,
                icon: user?.enabled ? <LuToggleRight /> : <LuToggleLeft />,
                label: user?.enabled ? 'Désactivé' : 'Activé',
                onClick: setEnable,
                disabled: sameUser
            },
            {
                key: `lock-${user?.id}`,
                icon: user?.accountNonLocked ? <LuLock /> : <LuLockOpen />,
                label: user?.accountNonLocked ? 'Vérrouiller' : 'Déverrouiller',
                onClick: setAccountNoLocked,
                disabled: sameUser
            },
            { type: 'divider' },
            {
                key: `reset-${user?.id}`,
                icon: <LuKeyRound />,
                label: "Réinitialiser mot de passe",
                onClick: () => setPasswordReset()
            },
            ...(sameUser ? [{
                key: `change-${user?.id}`,
                icon: <LuLockKeyhole />,
                label: "Changer mot de passe",
                onClick: () => toChangePassword(user?.id as number, getSlug({firstName: user?.firstName, lastName: user?.lastName}))
            }] : []),
            { type: 'divider' },
            {
                key: `delete-${user?.id}`,
                icon: <AiOutlineUserDelete />,
                label: 'Retirer Utilisateur',
                danger: true,
                disabled: sameUser,
                onClick: setRemoveUser
            }
        ] as ItemType[]
    }, [
        sameUser, setAccountNoLocked, setEnable, setPasswordReset, setRemoveUser, setRoleManage, toChangePassword,
        toUserActivity, user?.accountNonLocked, user?.enabled, user?.firstName, user?.id, user?.lastName
    ])

   useMenuItemsEffect(items, getItems)

    const handleCloseUserRole = () => {
        setRoleManage()
    }

    return(
        <section>
            <UserRoles user={user as User} open={roleManage} close={handleCloseUserRole} setRefresh={setRefresh} sameUser={sameUser} />
            <UserAccountEnabled user={user as User} open={enable} close={setEnable} setRefetch={setRefresh} />
            <UserAccountLocked user={user as User} open={accountNoLocked} close={setAccountNoLocked} setRefetch={setRefresh}/>
            <UserRemoveAccount user={user as User} open={removeUser} close={setRemoveUser} setRefetch={setRefresh}/>
            <ResetPassword user={user as User} open={passwordReset} close={setPasswordReset}/>
        </section>
    )
}