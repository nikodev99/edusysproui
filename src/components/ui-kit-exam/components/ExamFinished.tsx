import {Modal} from "antd";
import {ModalConfirmButton} from "../../ui/layout/ModalConfirmButton.tsx";
import {PatchUpdate} from "../../../core/PatchUpdate.ts";
import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";
import {useState} from "react";
import {UpdateType} from "../../../core/shared/sharedEnums.ts";

export const ExamFinished = ({assignmentId, open, close}: {
    assignmentId: number,
    open: boolean,
    close: () => void,
}) => {

    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const handleFinish = async () => {
        await PatchUpdate.set(
            'passed',
            {passed: true},
            assignmentId,
            () => setSuccessMessage("Devoir traité avec succès"),
            setErrorMessage,
            UpdateType.ASSIGNMENT
        )
    }

    return(
        <>
            {successMessage && <FormSuccess message={successMessage} />}
            {errorMessage && <FormError message={errorMessage} />}
            <Modal open={open} onCancel={close} destroyOnClose title={"Terminer avec le devoir"} footer={null}>
                <p style={{marginBottom: '15px'}}>
                    Si vous avez déjà noté le devoir, cliquez sur le button ci-dessous ensuite confirmé pour terminer avec le devoir
                </p>
                <div style={{textAlign: 'center'}}>
                    <ModalConfirmButton
                        handleFunc={handleFinish}
                        title='Souhaitez vous poursuivre ?'
                        content="Soyez assurer lorsque vous cliquerez sur OUI, vous n'aurez plus la possibilité de modifier quoi que ce soit pour ce devoir"
                        tooltipTxt='Cliqué pour terminer'
                        btnTxt='Traité'
                        btnProps={{type: 'primary'}}
                    />
                </div>
            </Modal>
        </>
    )
}