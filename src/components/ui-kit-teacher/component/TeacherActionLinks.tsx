import {ActionButtonsProps} from "@/core/utils/interfaces.ts";
import {useMemo, useState} from "react";
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
import {ConfirmationModal, Messages} from "@/components/ui/layout/ConfirmationModal.tsx";
import {setName} from "@/core/utils/utils.ts";
import {useTeacherRepo} from "@/hooks/actions/useTeacherRepo.ts";
import {catchError} from "@/data/action/error_catch.ts";
import {Alert} from "antd";

type TeacherActionButtons = ActionButtonsProps<Teacher> & {
    schoolId?: string
}

export const TeacherActionLinks = ({data, getItems, setRefresh, schoolId}: TeacherActionButtons) => {
    const [message, setMessage] = useState<Messages>({success: null, error: null})
    const [openCreateUser, setOpenCreateUser] = useToggle(false)
    const [removeTeacher, setRemoveTeacher] = useToggle(false)
    const {useAccountExists, useAccountExistsInSchool} = useAccount()
    const {useRemoveTeacherAffiliation} = useTeacherRepo()
    const {canCreate, canDelete} = usePermission()
    const {toViewTeacher} = useRedirect()

    const {personalInfo} = useMemo(() => ({
        personalInfo: data?.personalInfo
    }), [data])

    const accountExists = useAccountExists(personalInfo?.id as number)
    const remove = useRemoveTeacherAffiliation()
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
        {type: 'divider'},
        ...(canDelete ? [{
            key: `delete-${data?.id}`,
            label: 'Retirer l\'enseignant', 
            danger: true, 
            icon: <LuTrash2/>,
            onClick: () => setRemoveTeacher()
        }] : [])
    ], [
        accountExists, canCreate, canDelete, data?.id, isPresentInSchool, isSelf, setOpenCreateUser, setRemoveTeacher,
        toViewTeacher
    ])

    useMenuItemsEffect(items, getItems)

    const onClose = () => {
        setMessage({success: null, error: null})
        setRefresh?.(true)
        setRemoveTeacher()
    }

    const onDeleteTeacher = () => {
        setMessage({success: null, error: null})
        remove.mutate({
            teacherId: data?.id as string, schoolId: schoolId as string
        }, {
            onSuccess: r => setMessage({success: r.data}),
            onError: e => setMessage({error: catchError(e) as string})
        })
    }

    return (
        <section>
            {canCreate && openCreateUser && <CreateUser
                open={openCreateUser}
                onCancel={setOpenCreateUser}
                personalInfo={personalInfo}
                userType={UserType.TEACHER}
            />}
            {canDelete && removeTeacher && <ConfirmationModal
                open={removeTeacher}
                close={onClose}
                setRefetch={setRefresh as () => void}
                handleFunc={onDeleteTeacher}
                content={<Alert type='warning' message={"Lorsque vous confirmerez, cet enseignant ne sera plus active dans votre " +
                    "établissement. Toutes les données qu'il a ajouté pour le compte de votre établissement demeurera accessible."} />}
                alertDesc={{type: 'warning', msg: "Lorsque vous confirmerez, cet enseignant ne sera plus active dans votre " +
                        "établissement. Toutes les données qu'il a ajouté pour le compte de votre établissement demeurera accessible."}}
                data={data as Teacher}
                btnTxt='Supprimer'
                btnProps={{
                    danger: true,
                    type: 'default',
                    variant: 'solid'
                }}
                messages={message}
                modalTitle={<span>Supprimé {setName(data?.personalInfo)}</span>}
            />}
        </section>
    )
}