import {ActionButtonsProps} from "@/core/utils/interfaces.ts";
import {useMemo} from "react";
import {CreateUser} from "../../common/CreateUser.tsx";
import {UserType} from "@/auth/dto/user.ts";
import {Teacher} from "@/entity";
import {useToggle} from "@/hooks/useToggle.ts";
import {usePermission} from "@/hooks/usePermission.ts";
import {useAccount} from "@/hooks/useAccount.ts";
import {ItemType} from "antd/es/menu/interface";
import {LuClipboardPenLine, LuListChecks, LuListTodo, LuTrash2, LuUserCheck, LuUserMinus} from "react-icons/lu";
import {useMenuItemsEffect} from "@/hooks/useMenuItemsEffect.ts";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {useUserRepo} from "@/hooks/actions/useUserRepo.ts";

type TeacherActionButtons = ActionButtonsProps<Teacher>

export const TeacherActionLinks = ({data, getItems}: TeacherActionButtons) => {
    const [openCreateUser, setOpenCreateUser] = useToggle(false)
    const [removeGuardian, setRemoveGuardian] = useToggle(false)
    const {useAccountExists, useAccountExistsInSchool} = useAccount()
    const {canCreate, canDelete, can} = usePermission()
    const {toViewTeacher, toDiscipline, toExam} = useRedirect()

    const {personalInfo} = useMemo(() => ({
        personalInfo: data?.personalInfo
    }), [data])

    const accountExists = useAccountExists(personalInfo?.id as number)
    const {isSelfUser} = useUserRepo()
    const isSelf = isSelfUser()
    const isPresentInSchool = useAccountExistsInSchool(personalInfo?.id as number)

    const items: ItemType[] = useMemo(() => [
        ...(canCreate ? [{
            key: `account-${data?.id}`,
            label: accountExists ? 'Affilier l\'enseignant' : 'Créer compte enseignant', 
            icon: <LuUserCheck/>, 
            onClick: setOpenCreateUser,
            disabled: isPresentInSchool
        }] : []),
        
        ...(isSelf ? [{
            key: `programme-${data?.id}`, 
            label: 'Programme', 
            icon: <LuListChecks/>,
            onClick: () => toViewTeacher(data?.id as string, '2'),
        }] : []),
        ...(isSelf ? [{
            key:`exam-${data?.id}`,
            label: 'Les examen', 
            icon: <LuClipboardPenLine/>,
            onClick: () => toViewTeacher(data?.id as string, '3'),
        }] : []),
        ...(isSelf ? [{
            key: `reprimand-${data?.id}`,
            label: 'Réprimander',
            onClick: () => toViewTeacher(data?.id as string, '4'),
            icon: <LuUserMinus/>
        }] : []),
        ...(isSelf ? [{
            key: `report-${data?.id}`,
            label: 'Compte rendu',
            icon: <LuListTodo/>,
            onClick: () => toViewTeacher(data?.id as string, '5'),
        }] : []),

        ...(canDelete ? [{
            key: `delete-${data?.id}`,
            label: 'Retirer l\'enseignant', 
            danger: true, 
            icon: <LuTrash2/>
        }] : [])
    ], [accountExists, canCreate, canDelete, data?.id, isPresentInSchool, isSelf, setOpenCreateUser, toViewTeacher])

    useMenuItemsEffect(items, getItems)

    return (
        <section>
            {canCreate && openCreateUser && <CreateUser
                open={openCreateUser}
                onCancel={setOpenCreateUser}
                personalInfo={personalInfo}
                userType={UserType.TEACHER}
            />}
        </section>
    )
}