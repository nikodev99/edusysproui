import {User} from "../../../auth/dto/user.ts";
import {useCallback, useMemo, useState} from "react";
import {removeUserAccount} from "../../../data/repository/userRepository.ts";
import {PatchUpdate} from "../../../core/PatchUpdate.ts";
import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";
import {Alert, Modal} from "antd";
import {setName} from "../../../core/utils/utils.ts";
import {Individual} from "../../../entity";
import {ModalConfirmButton} from "../../ui/layout/ModalConfirmButton.tsx";
import {text} from "../../../core/utils/text_display.ts";
import {LuTrash2} from "react-icons/lu";
import {useRedirect} from "../../../hooks/useRedirect.ts";

export const UserRemoveAccount = ({user, open, close, setRefetch}: {
    user: User,
    open: boolean,
    close: () => void,
    setRefetch?: (refetch: boolean) => void
}) => {
    const {toUserList} = useRedirect()
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const enableCons = useMemo(() => 
            "La suppression supprime définitivement l’accès de l’utilisateur et les données liées (profil, contenus, historiques, " +
            "permissions), l’empêchant de se reconnecter et provoquant la perte irréversible de ces informations mais garde l'activité " +
            "précédente de l'utilisateur supprimé."
    ,[])

    const handleFinish = useCallback(async () => {
        setRefetch?.(false)
        await PatchUpdate.setWithCustom(
            removeUserAccount as () => Promise<never>,
            () => setSuccessMessage(`Le compte a été supprimé avec succès!!`),
            setErrorMessage,
            [user?.account]
        )
    }, [setRefetch, user?.account])

    const handleCancel = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        setRefetch?.(true)
        close()
        toUserList()
    }

    return(
        <>
            {successMessage && <FormSuccess message={successMessage} redirectLink={text.org.group.user.href} />}
            {errorMessage && <FormError message={errorMessage} isNotif />}
            <Modal
                open={open}
                onCancel={handleCancel}
                destroyOnClose
                title={`Supprimé le compte de  ${setName({firstName: user?.firstName, lastName: user?.lastName} as Individual)}`}
                footer={null}
            >
                {successMessage && <Alert type={'success'} message={successMessage} closeIcon showIcon style={{marginBottom: '10px'}} />}
                {errorMessage && <Alert type={'error'} message={errorMessage} closeIcon showIcon style={{marginBottom: '10px'}} />}
                <Alert style={{marginBottom: '15px'}} message={enableCons} showIcon />
                <div style={{textAlign: 'center'}}>
                    <ModalConfirmButton
                        handleFunc={handleFinish}
                        title='Souhaitez vous poursuivre ?'
                        content={`Veuillez cliquer sur OUI unilateralement supprimer ce compte`}
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