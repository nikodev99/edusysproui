import FormSuccess from "@/components/ui/form/FormSuccess.tsx";
import FormError from "@/components/ui/form/FormError.tsx";
import {Modal} from "antd";
import {ModalConfirmButton} from "@/components/ui/layout/ModalConfirmButton.tsx";
import {useState} from "react";
import {useRawFetch} from "@/hooks/useFetch.ts";
import {deletePlanning} from "@/data/repository/planningRepository.ts";

export const PlanningRemoveModal = ({planningId, open, close}: {
    planningId: number,
    open: boolean,
    close: () => void
}) => {
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const triggerDelete = useRawFetch<Record<string, boolean>>()

    const handleRemove = () => {
        triggerDelete(deletePlanning, [planningId])
            .then(resp => {
                if (resp?.isSuccess) {
                    setSuccessMessage("Planning Supprimer avec succès")
                }else {
                    setErrorMessage(resp?.error)
                }
            })
    }

    return(
        <>
            {successMessage && <FormSuccess message={successMessage} />}
            {errorMessage && <FormError message={errorMessage} />}
            <Modal open={open} onCancel={close} destroyOnHidden title={"Supprimer le planning"} footer={null}>
                <p style={{marginBottom: '15px'}}>
                    Cliquez le bouton ci-dessous pour supprimer ce planning
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