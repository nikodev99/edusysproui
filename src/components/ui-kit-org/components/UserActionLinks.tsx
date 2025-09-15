import {ItemType} from "antd/es/menu/interface";
import {Tooltip} from "antd";
import {isAdmin} from "../../../auth/dto/role.ts";
import {useEffect, useMemo} from "react";
import {
    LuKeyRound,
    LuLock,
    LuLockOpen,
    LuSheet,
    LuToggleLeft,
    LuToggleRight,
    LuUserPen
} from "react-icons/lu";
import {AiOutlineUserDelete} from "react-icons/ai";
import {User} from "../../../auth/dto/user.ts";
import {loggedUser} from "../../../auth/jwt/LoggedUser.ts";
import {useToggle} from "../../../hooks/useToggle.ts";
import {UserRoles} from "./UserRoles.tsx";

type UserActionButtons = {
    user?: User 
    getItems?: (items: ItemType[]) => void
    setRefresh?: () => void
    loadMessage?: { success?: string; error?: string }
    deleteTab?: (tab: string) => void
}

export const UserActionLinks = ({user, getItems, setRefresh, loadMessage, deleteTab,}: UserActionButtons) => {
    const userLogged = loggedUser.getUser()

    const [roleManage, setRoleManage] = useToggle(false)

    const isSameUser = useMemo(() => user?.username === userLogged?.username, [user?.username, userLogged?.username])
    
    const items: ItemType[] = useMemo(() => {
        return [
            {
                key: `account-${user?.id}`,
                icon: <LuUserPen />,
                label: 'Manager Roles',
                onClick: () => setRoleManage()
            },
            {
                key: `activity-${user?.id}`,
                icon: <LuSheet />,
                label: 'Voir Activité',
                onClick: () => alert('Création de compte')
            },
            { type: 'divider' },
            {
                key: `enable-${user?.id}`,
                icon: user?.enabled ? <LuToggleRight /> : <LuToggleLeft />,
                label: user?.enabled ? 'Désactivé' : 'Activé',
                onClick: () => alert('Création de compte')
            },
            {
                key: `lock-${user?.id}`,
                icon: user?.accountNonLocked ? <LuLock /> : <LuLockOpen />,
                label: user?.accountNonLocked ? 'Vérrouiller' : 'Déverrouiller',
                onClick: () => alert('Création de compte')
            },
            { type: 'divider' },
            {
                key: `reset-${user?.id}`,
                icon: <LuKeyRound />,
                label: <Tooltip title={'yeye'}>Réinitialiser mot de passe</Tooltip>,
                disabled: isAdmin(user?.roles as []) && !isSameUser,
            },
            {
                key: `delete-${user?.id}`,
                icon: <AiOutlineUserDelete />,
                label: 'Retirer Utilisateur',
                danger: true,
                disabled: isAdmin(user?.roles as []) && isSameUser,
            }
        ]
    }, [isSameUser, user?.accountNonLocked, user?.enabled, user?.id, user?.roles])

    useEffect(() => {
        getItems?.(items)
    }, [getItems, items]);

    const handleCloseUserRole = () => {
        setRoleManage()
    }


    return(
        <section>
            <UserRoles user={user as User} open={roleManage} close={handleCloseUserRole} />
        </section>
    )
}