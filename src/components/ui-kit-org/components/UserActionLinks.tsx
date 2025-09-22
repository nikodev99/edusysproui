import {ItemType} from "antd/es/menu/interface";
import {Tooltip} from "antd";
import {isAdmin} from "../../../auth/dto/role.ts";
import {useCallback, useEffect, useMemo, useRef} from "react";
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
import {UserAccountEnabled} from "./UserAccountEnabled.tsx";
import {UserAccountLocked} from "./UserAccountLocked.tsx";
import {UserRemoveAccount} from "./UserRemoveAccount.tsx";

type UserActionButtons = {
    user?: User 
    getItems?: (items: ItemType[]) => void
    setRefresh?: (value: boolean) => void
    loadMessage?: { success?: string; error?: string }
    deleteTab?: (tab: string) => void
}

export const UserActionLinks = ({user, getItems, setRefresh, loadMessage, deleteTab}: UserActionButtons) => {
    const userLogged = loggedUser.getUser()

    const [roleManage, setRoleManage] = useToggle(false)
    const [enable, setEnable] = useToggle(false)
    const [accountNoLocked, setAccountNoLocked] = useToggle(false)
    const [removeUser, setRemoveUser] = useToggle(false)
    const prevItemsRef = useRef<ItemType[] | undefined>(undefined);

    const isSameUser = useMemo(() => user?.username === userLogged?.username, [user?.username, userLogged?.username])

    console.log("ALL ENABLES: ", user?.enabled)
    
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
                onClick: () => alert('Création de compte')
            },
            { type: 'divider' },
            {
                key: `enable-${user?.id}`,
                icon: user?.enabled ? <LuToggleRight /> : <LuToggleLeft />,
                label: user?.enabled ? 'Désactivé' : 'Activé',
                onClick: setEnable
            },
            {
                key: `lock-${user?.id}`,
                icon: user?.accountNonLocked ? <LuLock /> : <LuLockOpen />,
                label: user?.accountNonLocked ? 'Vérrouiller' : 'Déverrouiller',
                onClick: setAccountNoLocked
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
                onClick: setRemoveUser
            }
        ]
    }, [
        isSameUser, setAccountNoLocked, setEnable, setRemoveUser, setRoleManage, user?.accountNonLocked, user?.enabled,
        user?.id, user?.roles
    ])

    const itemsAreShallowEqual = useCallback((a?: ItemType[], b?: ItemType[]) => {
        if (a === b) return true;
        if (!a || !b) return false;
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            const ai: ItemType = a[i];
            const bi: ItemType = b[i];
            if (ai?.key !== bi?.key) return false;
        }
        return true;
    }, []);

    useEffect(() => {
        if (!getItems) return;
        const prev = prevItemsRef.current;
        if (itemsAreShallowEqual(prev, items)) return; // pas de changement réel → pas d'appel
        prevItemsRef.current = items;
        getItems(items);
    }, [getItems, items, itemsAreShallowEqual]);

    console.log({removeUser})

    const handleCloseUserRole = () => {
        setRoleManage()
    }

    return(
        <section>
            <UserRoles user={user as User} open={roleManage} close={handleCloseUserRole} setRefresh={setRefresh} />
            <UserAccountEnabled user={user as User} open={enable} close={setEnable} setRefetch={setRefresh} />
            <UserAccountLocked user={user as User} open={accountNoLocked} close={setAccountNoLocked} setRefetch={setRefresh}/>
            <UserRemoveAccount user={user as User} open={removeUser} close={setRemoveUser} setRefetch={setRefresh}/>
        </section>
    )
}