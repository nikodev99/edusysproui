import {Card, Modal} from "antd";
import {AssignmentDescription} from "../../core/utils/tsxUtils.tsx";
import {Assignment} from "../../entity";
import {AssignmentScores} from "../ui/layout/AssignmentScores.tsx";
import {ReactNode, useState} from "react";
import {removeAssignment} from "../../data/repository/assignmentRepository.ts";
import {useRawFetch} from "../../hooks/useFetch.ts";
import {UpdateAssignmentDates} from "../ui-kit-exam";
import {useToggle} from "../../hooks/useToggle.ts";
import FormSuccess from "../ui/form/FormSuccess.tsx";

type AssignmentViewDescProps = {
    assignment: Assignment | null
    show?: boolean
    plus?: boolean
    remove?: (assignmentId?: bigint) => void
    title?: ReactNode
    modalTitle?: ReactNode
    isModal?: boolean
    isModalOpen?: boolean
    onModalCancel?: () => void
    setWasDeleted?: (wasDeleted: { status: boolean }) => void
    setWasUpdated?: (wasUpdated: { updated: boolean }) => void
    showBest?: boolean
    scoreSize?: number
    onlyMark?: string
    showLink?: boolean
    setRefetch?: (refetch: boolean) => void
}

export const AssignmentViewDesc = (
    {
        title, isModal, isModalOpen, onModalCancel, assignment, show, plus = true, remove, setWasDeleted, setWasUpdated,
        showBest, scoreSize = 5, onlyMark, showLink = true, setRefetch, modalTitle
    }: AssignmentViewDescProps
) => {
    const [deleteCompleted, setDeleteCompleted] = useState<{ status: boolean }>({status: false})
    const [openUpdater, setUpdater] = useToggle(false)
    const triggerDelete = useRawFetch<Record<string, boolean>>()

    const handleRemoveAssignment = (assignmentId?: bigint) => {
        if (remove) {
            remove(assignmentId)
            return
        }
        triggerDelete(removeAssignment, [assignmentId])
            .then(resp => {
                if (resp.isSuccess) {
                    setDeleteCompleted(resp.data as { status: boolean })
                    setWasDeleted?.(resp.data as { status: boolean })
                    if (deleteCompleted.status) {
                        setRefetch?.(true)
                    }
                }
            })
    }

    const handleUpdated = (wasUpdated: { updated: boolean }) => {
        setWasUpdated?.(wasUpdated)
        if (wasUpdated?.updated) {
            setRefetch?.(true)
        }
    }

    const handleModalCancel = () => {
        onModalCancel?.()
        setWasDeleted?.({status: false})
        setWasUpdated?.({updated: false})
        setRefetch?.(false)
    }

    return(
        <>
        {deleteCompleted?.status && <FormSuccess message={'Evaluation Supprimer avec succès'} />}
        {
            isModal ? (
                <Modal zIndex={900} title={modalTitle} open={isModalOpen} footer={null} onCancel={handleModalCancel} destroyOnClose>
                    <Card title={title} size={'small'}>
                        <AssignmentDescription
                            a={assignment as Assignment}
                            show={show}
                            plus={plus}
                            remove={handleRemoveAssignment}
                            openUpdater={setUpdater}
                            showBest={showBest}
                            link={showLink}
                        />
                        {assignment?.passed && <AssignmentScores
                            assignmentId={assignment?.id}
                            size={scoreSize}
                            markId={onlyMark}
                        />}
                    </Card>
                </Modal>
            ): (
                <Card title={title} size={'small'}>
                    <AssignmentDescription
                        title={title}
                        a={assignment as Assignment}
                        show={show}
                        plus={plus}
                        remove={handleRemoveAssignment}
                        openUpdater={setUpdater}
                        showBest={showBest}
                        link={showLink}
                    />
                    {assignment?.passed && <AssignmentScores assignmentId={assignment?.id} markId={onlyMark} />}
                </Card>
            )
        }
        <UpdateAssignmentDates assignment={assignment} open={openUpdater} onCancel={setUpdater} resp={handleUpdated} />
        </>
    )
}
