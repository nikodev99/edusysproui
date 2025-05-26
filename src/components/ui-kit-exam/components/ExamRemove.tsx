import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";
import {Modal} from "antd";
import {ModalConfirmButton} from "../../ui/layout/ModalConfirmButton.tsx";
import {useState} from "react";
import {removeAssignment} from "../../../data/repository/assignmentRepository.ts";
import {useRawFetch} from "../../../hooks/useFetch.ts";

export const ExamRemove = (
    {assignmentId, open, close, setWasDeleted}: {
        assignmentId: number,
        open: boolean,
        close: () => void,
        setWasDeleted?: (status: boolean) => void,
    }
) => {
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const triggerDelete = useRawFetch<Record<string, boolean>>()

    const handleRemove = () => {
        triggerDelete(removeAssignment, [assignmentId])
            .then(resp => {
                if (resp?.isSuccess) {
                    setSuccessMessage("Evaluation Supprimer avec succès")
                    setWasDeleted && setWasDeleted(true)
                }else {
                    setErrorMessage(resp?.error)
                }
            })
    }

    return(
        <>
            {successMessage && <FormSuccess message={successMessage} />}
            {errorMessage && <FormError message={errorMessage} />}
            <Modal open={open} onCancel={close} destroyOnClose title={"Terminer avec le devoir"} footer={null}>
                <p style={{marginBottom: '15px'}}>
                    Cliquez le bouton ci-dessous pour supprimer ce devoir
                </p>
                <div style={{textAlign: 'center'}}>
                    <ModalConfirmButton
                        handleFunc={handleRemove}
                        btnTxt='Supprimer'
                        btnProps={{
                            danger: true,
                        }}
                    />
                </div>
            </Modal>
        </>
    )
}