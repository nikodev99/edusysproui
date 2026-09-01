import {Assignment} from "@/entity";
import {ItemType} from "antd/es/menu/interface";
import FormSuccess from "@/components/ui/form/FormSuccess.tsx";
import FormError from "@/components/ui/form/FormError.tsx";
import {ExamFinished} from "./ExamFinished.tsx";
import {UpdateAssignmentDates} from "./UpdateAssignment.tsx";
import {ExamRemove} from "./ExamRemove.tsx";
import {LuArchiveX, LuCalendarMinus2, LuListCheck} from "react-icons/lu";
import {useToggle} from "@/hooks/useToggle.ts";
import React, {useEffect, useState, useCallback, useMemo} from "react";
import {redirectTo} from "@/context/RedirectContext.ts";
import {text} from "@/core/utils/text_display.ts";
import {useScoreRepo} from "@/hooks/actions/useScoreRepo.ts";
import {useMenuItemsEffect} from "@/hooks/useMenuItemsEffect.ts";
import {ActionButtonsProps} from "@/core/utils/interfaces.ts";
import {usePermission} from "@/hooks/usePermission.ts";
import {useUserRepo} from "@/hooks/actions/useUserRepo.ts";

interface ExamActionLinksProps {
    loadMessage?: {success?: string, error?: string}
    deleteTab?: (tab: string) => void
}

export const ExamActionLinks = React.memo((
    {data, setRefresh, getItems, loadMessage, deleteTab}: ActionButtonsProps<Assignment> & ExamActionLinksProps
) => {
    const [finish, setFinish] = useToggle(false)
    const [remove, setRemove] = useToggle(false)
    const [openChangeDate, setOpenChangeDate] = useToggle(false)
    const [notify, setNotify] = useState<'completed' | 'date' | 'remove' | false>()
    const [wasDeleted, setWasDeleted] = useState<boolean>(false)
    const [messages, setMessages] = useState<{success?: string, error?: string}>()
    const {isSelf} = useUserRepo()
    const {canDelete, canViewAll} = usePermission()
    
    const isAbleToDelete = (canDelete && canViewAll) || (canDelete && isSelf(data?.preparedBy?.id as number))

    const {useCountAssignmentMarks} = useScoreRepo()
    const scoreCount = useCountAssignmentMarks(data?.id as number) || 0

    const handleCompleteAssignment = useCallback(() => {
        if (scoreCount > 0) {
            setFinish()
            deleteTab && deleteTab("2")
        }else {
            setNotify('completed')
        }
    }, [scoreCount, deleteTab, setFinish])

    const handleChangeDate = useCallback(() => {
        if (scoreCount > 0) {
            setNotify('date')
        }else {
            setOpenChangeDate()
        }
    }, [scoreCount, setOpenChangeDate])

    const handleOpenRemoveModal = useCallback(() => {
        if (scoreCount > 0) {
            setNotify('remove')
        }else {
            setRemove()
        }
    }, [scoreCount, setRemove])

    const itemType: ItemType[] = useMemo(() => [
        ...(data && data?.passed ? [] : [
            {
                key: 3,
                label: 'Traité',
                icon: <LuListCheck/>,
                onClick: handleCompleteAssignment,
                disabled: notify === 'completed'
            },
            {
                key: 4,
                label: 'Changer de date',
                icon: <LuCalendarMinus2/>,
                onClick: handleChangeDate,
                disabled: notify === 'date'
            },
            ...(isAbleToDelete ? [{type: "divider"}, {
                key: 5,
                label: 'Supprimer',
                danger: true,
                icon: <LuArchiveX />,
                onClick: handleOpenRemoveModal,
                disabled: notify === 'remove'
            }] : [])
        ]) as ItemType[],
    ], [data, handleCompleteAssignment, notify, handleChangeDate, isAbleToDelete, handleOpenRemoveModal])

    useMenuItemsEffect(itemType, getItems)
    
    useEffect(() => {
        if (loadMessage) {
            setMessages(loadMessage)
        }
    }, [loadMessage])


    const handleFinish = () => {
        setFinish()
        setRefresh?.(true)
    }

    const handleChangeDateClose = () => {
        setOpenChangeDate()
        setRefresh?.(true)
    }

    const handleRemoveAssignment = () => {
        setRemove()
        if (wasDeleted) {
            redirectTo(text.exam.href)
        }
    }

    const getNotificationMessage = () => {
        switch (notify) {
            case 'completed':
                return "Ce devoir n'a pas été noté par conséquent vous ne pouvez pas le traiter"
            case 'date':
                return "Ce devoir est déjà noté par conséquent vous ne pouvez pas changer de date"
            case 'remove':
                return "Ce devoir est déjà noté par conséquent vous ne pouvez pas le supprimer"
            default:
                return ''
        }
    }

    return(
        <section>
            {notify && <FormSuccess
                message={getNotificationMessage() as string}
                type='info'
                onClose={() => setNotify(false)}
                isNotif
            />}
            {messages?.success && <FormSuccess message={messages?.success} />}
            {messages?.error && <FormError message={messages?.error} />}

            {data && finish && (
                <ExamFinished
                    assignmentId={data?.id as number}
                    open={finish}
                    close={handleFinish}
                />
            )}
            {data && openChangeDate && (
                <UpdateAssignmentDates
                    assignment={data as Assignment}
                    open={openChangeDate}
                    onCancel={handleChangeDateClose}
                />
            )}
            {data && remove && (
                <ExamRemove
                    assignmentId={data?.id as number}
                    open={remove}
                    close={handleRemoveAssignment}
                    setWasDeleted={setWasDeleted}
                />
            )}
        </section>
    )
})