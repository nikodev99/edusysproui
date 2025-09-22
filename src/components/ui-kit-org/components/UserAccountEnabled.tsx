import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";
import {Alert, Modal} from "antd";
import {ModalConfirmButton} from "../../ui/layout/ModalConfirmButton.tsx";
import {useCallback, useMemo, useState} from "react";
import {PatchUpdate} from "../../../core/PatchUpdate.ts";
import {User} from "../../../auth/dto/user.ts";
import {firstLetter, setName} from "../../../core/utils/utils.ts";
import {Individual} from "../../../entity";
import {LuToggleLeft, LuToggleRight} from "react-icons/lu";
import {setDisableAccount, setEnableAccount} from "../../../data/repository/userRepository.ts";

export const UserAccountEnabled = ({user, open, close, setRefetch}: {
    user: User,
    open: boolean,
    close: () => void,
    setRefetch?: (refetch: boolean) => void
}) => {
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    
    const enableText = useMemo(() => user?.enabled ? 'désactiver' : 'activer', [user?.enabled])
    const enableCons = useMemo(() => user?.enabled
        ? "L'activation autorise l'utilisateur à se connecter et à utiliser toutes les fonctionnalités associées à ses roles"
        : "La désactivation bloque l'accès, suspend les actions et restreint la visibilité de données de l'utilisateur jusqu'à réactivation.",
        [user?.enabled]
    )
    
    const enableMethod = useCallback((accountId: number) => 
        user?.enabled ? setDisableAccount(accountId) : setEnableAccount(accountId), [user?.enabled])

    const handleFinish = useCallback(async () => {
        setRefetch?.(false)
        await PatchUpdate.setWithCustom(
            enableMethod as () => Promise<never> ,
            () => setSuccessMessage(`Le compte a été ${enableText} avec succès!!`),
            setErrorMessage,
            [user?.account]
        )
    }, [enableMethod, enableText, setRefetch, user?.account])
    
    const handleCancel = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        setRefetch?.(true)
        close()
    }

    return(
        <>
            {successMessage && <FormSuccess message={successMessage} isNotif />}
            {errorMessage && <FormError message={errorMessage} isNotif />}
            <Modal
                open={open}
                onCancel={handleCancel}
                destroyOnClose
                title={`${firstLetter(enableText)} le compte de  ${setName({firstName: user?.firstName, lastName: user?.lastName} as Individual)}`}
                footer={null}
            >
                {successMessage && <Alert type={'success'} message={successMessage} closeIcon showIcon style={{marginBottom: '10px'}} />}
                {errorMessage && <Alert type={'error'} message={errorMessage} closeIcon showIcon style={{marginBottom: '10px'}} />}
                <Alert style={{marginBottom: '15px'}} message={enableCons} showIcon />
                <div style={{textAlign: 'center'}}>
                    <ModalConfirmButton
                        handleFunc={handleFinish}
                        title='Souhaitez vous poursuivre ?'
                        content={`Veuillez cliquer sur OUI pour ${enableText} le compte`}
                        tooltipTxt={`Cliquer pour ${enableText}`}
                        btnTxt={firstLetter(enableText)}
                        btnProps={{
                            icon: user?.enabled ? <LuToggleRight /> : <LuToggleLeft />,
                            variant: 'solid',
                            color: user?.enabled ? 'red' : 'green',
                        }}
                    />
                </div>
            </Modal>
        </>
    )
}