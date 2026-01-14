import {ActionButtonsProps} from "@/core/utils/interfaces.ts";
import {useMemo} from "react";
import {CreateUser} from "@/components/common/CreateUser.tsx";
import {UserType} from "@/auth/dto/user.ts";
import {Guardian} from "@/entity";
import {AiOutlineUserDelete} from "react-icons/ai";
import {useMenuItemsEffect} from "@/hooks/useMenuItemsEffect.ts";
import {useToggle} from "@/hooks/useToggle.ts";
import {useAccount} from "@/hooks/useAccount.ts";
import {LuMessageCircle, LuReceipt, LuUserPlus} from "react-icons/lu";

type GuardianActionButtons = ActionButtonsProps<Guardian>

export const GuardianActionLinks = ({data, getItems, setRefresh}: GuardianActionButtons) => {
    const [openCreateUser, setOpenCreateUser] = useToggle(false)
    const {useAccountExists} = useAccount()

    const {personalInfo} = useMemo(() => ({
        personalInfo: data?.personalInfo
    }), [data])

    const accountExists = useAccountExists(personalInfo?.id as number)

    const items = [
        {
            key: `account-${data?.id}`,
            icon: <LuUserPlus />,
            label: 'Créer compte tuteur',
            onClick: () => setOpenCreateUser()
        },
        {
            key: `@payments-${data?.id}`,
            icon: <LuReceipt />,
            label: 'Paiements',
            onClick: () => alert('Création de compte')
        },
        {
            key: `@contact-${data?.id}`,
            icon: <LuMessageCircle />,
            label: 'Contacter',
            onClick: () => alert('Création de compte')
        },
        {
            key: `@remove-${data?.id}`,
            icon: <AiOutlineUserDelete />,
            label: 'Supprimer',
            danger: true
        }
    ]

    useMenuItemsEffect(items, getItems)

    return (
        <section>
            {!accountExists && <CreateUser
                open={openCreateUser}
                onCancel={setOpenCreateUser}
                personalInfo={personalInfo}
                userType={UserType.GUARDIAN}
            />}
        </section>
    )
}