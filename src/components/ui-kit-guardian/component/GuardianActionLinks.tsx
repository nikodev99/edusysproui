import {ActionButtonsProps} from "@/core/utils/interfaces.ts";
import {useMemo} from "react";
import {CreateUser} from "@/components/common/CreateUser.tsx";
import {UserType} from "@/auth/dto/user.ts";
import {Guardian} from "@/entity";
import {AiOutlineUserDelete} from "react-icons/ai";
import {useMenuItemsEffect} from "@/hooks/useMenuItemsEffect.ts";
import {useToggle} from "@/hooks/useToggle.ts";
import {useAccount} from "@/hooks/useAccount.ts";
import {
    LuBanknote,
    LuMessageCircle,
    LuReceipt,
    LuSettings2,
    LuUserPlus
} from "react-icons/lu";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {usePermission} from "@/hooks/usePermission.ts";
import {ItemType} from "antd/es/menu/interface";

type GuardianActionButtons = ActionButtonsProps<Guardian>

export const GuardianActionLinks = ({data, getItems}: GuardianActionButtons) => {
    const [openCreateUser, setOpenCreateUser] = useToggle(false)
    const {useAccountExists, useAccountExistsInSchool} = useAccount()
    const {toGuardianPay, toGuardianInv, toGuardianBilling} = useRedirect()
    const {canCreate, canDelete, can} = usePermission()

    const {personalInfo} = useMemo(() => ({
        personalInfo: data?.personalInfo
    }), [data])

    const accountExists = useAccountExists(personalInfo?.id as number)
    const isPresent = useAccountExistsInSchool(personalInfo?.id as number)

    const items: ItemType[] = useMemo(() => [
        ...(canCreate ? [{
            key: `account-${data?.id}`,
            icon: <LuUserPlus />,
            label: accountExists ? 'Affilier le tuteur' : 'Créer compte tuteur',
            onClick: () => setOpenCreateUser(),
            disabled: isPresent
        }] : []),
        ...(can('pay', true) ? [{
            key: `@invoice-${data?.id}`,
            icon: <LuReceipt />,
            label: 'Facture à payer',
            onClick: () => toGuardianInv(data?.id as string)
        }] : []),
        {
            key: `@payments-${data?.id}`,
            icon: <LuBanknote />,
            label: 'Historique de Paiements',
            onClick: () => toGuardianPay(data?.id as string)
        },
        ...(can('pay', true) ? [{
            key: `@billing-${data?.id}`,
            icon: <div><LuSettings2 /></div>,
            label: 'Paramètres de facturation',
            onClick: () => toGuardianBilling(data?.id as string)
        }] : []),
        {
            key: `@contact-${data?.id}`,
            icon: <LuMessageCircle />,
            label: 'Contacter',
            onClick: () => alert("Pour le tuteur, contacter les professeurs ou responsable de l'école. Pour les autres, contacter le tuteur.")
        },
        ...(canDelete ? [{type: 'divider'}]: []),
        ...(canDelete ? [{
            key: `@remove-${data?.id}`,
            icon: <AiOutlineUserDelete />,
            label: 'Supprimer',
            danger: true
        }] : [])
    ] as ItemType[], [accountExists, can, canCreate, canDelete, data?.id, isPresent, setOpenCreateUser, toGuardianBilling, toGuardianInv, toGuardianPay])

    useMenuItemsEffect(items, getItems)

    return (
        <section>
            <CreateUser
                open={openCreateUser}
                onCancel={setOpenCreateUser}
                personalInfo={personalInfo}
                userType={UserType.GUARDIAN}
            />
        </section>
    )
}