import {Assignment} from "../../../entity";
import {ItemType} from "antd/es/menu/interface";
import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";
import {ExamFinished} from "./ExamFinished.tsx";
import {UpdateAssignmentDates} from "./UpdateAssignment.tsx";
import {ExamRemove} from "./ExamRemove.tsx";
import {LuArchiveX, LuCalendarMinus2, LuListCheck} from "react-icons/lu";
import {useToggle} from "../../../hooks/useToggle.ts";
import React, {useEffect, useState, useCallback, useMemo} from "react";
import {redirectTo} from "../../../context/RedirectContext.ts";
import {text} from "../../../core/utils/text_display.ts";
import {useScoreRepo} from "../../../hooks/actions/useScoreRepo.ts";

interface ExamActionLinksProps {
    assignment?: Assignment
    getLinks?: (items: ItemType[]) => void
    setRefetch?: (value: boolean) => void
    loadMessage?: {success?: string, error?: string}
    deleteTab?: (tab: string) => void
}

export const ExamActionLinks = React.memo((
    {assignment, setRefetch, getLinks, loadMessage, deleteTab}: ExamActionLinksProps
) => {
    const [finish, setFinish] = useToggle(false)
    const [remove, setRemove] = useToggle(false)
    const [openChangeDate, setOpenChangeDate] = useToggle(false)
    const [notify, setNotify] = useState<'completed' | 'date' | 'remove' | false>()
    const [wasDeleted, setWasDeleted] = useState<boolean>(false)
    const [messages, setMessages] = useState<{success?: string, error?: string}>()

    const {useCountAssignmentMarks} = useScoreRepo()
    const scoreCount = useCountAssignmentMarks(assignment?.id as number) || 0

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
        ...(assignment && assignment?.passed ? [] : [
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
            {
                key: 5,
                label: 'Supprimer',
                danger: true,
                icon: <LuArchiveX />,
                onClick: handleOpenRemoveModal,
                disabled: notify === 'remove'
            }
        ]),
    ], [assignment, handleCompleteAssignment, handleChangeDate, handleOpenRemoveModal, notify])

    useEffect(() => {
        getLinks && getLinks(itemType)
    }, [getLinks, assignment?.passed]);
    
    useEffect(() => {
        if (loadMessage) {
            setMessages(loadMessage)
        }
    }, [loadMessage])


    const handleFinish = () => {
        setFinish()
        setRefetch && setRefetch(true)
    }

    const handleChangeDateClose = () => {
        setOpenChangeDate()
        setRefetch && setRefetch(true)
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

            <ExamFinished assignmentId={assignment?.id as number} open={finish} close={handleFinish} />
            <UpdateAssignmentDates assignment={assignment as Assignment} open={openChangeDate} onCancel={handleChangeDateClose} />
            <ExamRemove assignmentId={assignment?.id as number} open={remove} close={handleRemoveAssignment} setWasDeleted={setWasDeleted} />
        </section>
    )
})