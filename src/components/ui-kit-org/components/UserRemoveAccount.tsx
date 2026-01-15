import {User} from "@/auth/dto/user.ts";
import {useCallback, useMemo, useState} from "react";
import {removeUserAccount} from "@/data/repository/userRepository.ts";
import {PatchUpdate} from "@/core/PatchUpdate.ts";
import FormSuccess from "@/components/ui/form/FormSuccess.tsx";
import FormError from "@/components/ui/form/FormError.tsx";
import {Alert, Modal} from "antd";
import {setName} from "@/core/utils/utils.ts";
import {Individual} from "@/entity";
import {ModalConfirmButton} from "@/components/ui/layout/ModalConfirmButton.tsx";
import {LuTrash2} from "react-icons/lu";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {ActionDrawer} from "@/core/utils/interfaces.ts";

export const UserRemoveAccount = ({data, open, close, setRefresh}: ActionDrawer<User>) => {
    const {toUserList} = useRedirect()
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const enableCons = useMemo(() => 
            "La suppression supprime définitivement l’accès de l’utilisateur et les données liées (profil, contenus, historiques, " +
            "permissions), l’empêchant de se reconnecter et provoquant la perte irréversible de ces informations mais garde l'activité " +
            "précédente de l'utilisateur supprimé."
    ,[])

    const handleFinish = useCallback(async () => {
        setRefresh?.(false)
        await PatchUpdate.setWithCustom(
            removeUserAccount as () => Promise<never>,
            () => setSuccessMessage(`Le compte a été supprimé avec succès!!`),
            setErrorMessage,
            [data?.account]
        )
    }, [setRefresh, data?.account])

    const handleCancel = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        setRefresh?.(true)
        close()
        toUserList()
    }

    return(
        <>
            {successMessage && <FormSuccess message={successMessage} setRedirect={toUserList} />}
            {errorMessage && <FormError message={errorMessage} isNotif />}
            <Modal
                open={open}
                onCancel={handleCancel}
                destroyOnHidden
                title={`Supprimé le compte de  ${setName({firstName: data?.firstName, lastName: data?.lastName} as Individual)}`}
                footer={null}
            >
                {successMessage && <Alert type={'success'} message={successMessage} closeIcon showIcon style={{marginBottom: '10px'}} />}
                {errorMessage && <Alert type={'error'} message={errorMessage} closeIcon showIcon style={{marginBottom: '10px'}} />}
                <Alert style={{marginBottom: '15px'}} message={enableCons} showIcon />
                <div style={{textAlign: 'center'}}>
                    <ModalConfirmButton
                        handleFunc={handleFinish}
                        title='Souhaitez vous poursuivre ?'
                        content={`Veuillez cliquer sur OUI pour unilateralement supprimer ce compte`}
                        tooltipTxt={`Cliquer pour rétiré l'utilisateur`}
                        btnTxt={'Rétiré l\'utilisateur'}
                        btnProps={{
                            icon: <LuTrash2 />,
                            type: 'default',
                            danger: true
                        }}
                    />
                </div>
            </Modal>
        </>
    )
}