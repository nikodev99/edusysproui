import FormSuccess from "@/components/ui/form/FormSuccess.tsx";
import FormError from "@/components/ui/form/FormError.tsx";
import {Alert, Modal} from "antd";
import {ModalConfirmButton} from "@/components/ui/layout/ModalConfirmButton.tsx";
import {useCallback, useMemo, useState} from "react";
import {PatchUpdate} from "@/core/PatchUpdate.ts";
import {User} from "@/auth/dto/user.ts";
import {firstLetter, setName} from "@/core/utils/utils.ts";
import {Individual} from "@/entity";
import {LuToggleLeft, LuToggleRight} from "react-icons/lu";
import {setDisableAccount, setEnableAccount} from "@/data/repository/userRepository.ts";
import {ActionDrawer} from "@/core/utils/interfaces.ts";

export const UserAccountEnabled = ({data, open, close, setRefresh}: ActionDrawer<User>) => {
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    
    const enableText = useMemo(() => data?.enabled ? 'désactiver' : 'activer', [data?.enabled])
    const enableCons = useMemo(() => !data?.enabled
        ? "L'activation autorise l'utilisateur à se connecter et à utiliser toutes les fonctionnalités associées à ses roles"
        : "La désactivation bloque l'accès, suspend les actions et restreint la visibilité de données de l'utilisateur jusqu'à réactivation.",
        [data?.enabled]
    )
    
    const enableMethod = useCallback((accountId: number) => 
        data?.enabled ? setDisableAccount(accountId) : setEnableAccount(accountId), [data?.enabled])

    const handleFinish = useCallback(async () => {
        setRefresh?.(false)
        await PatchUpdate.setWithCustom(
            enableMethod as () => Promise<never> ,
            () => setSuccessMessage(`Le compte a été ${enableText} avec succès!!`),
            setErrorMessage,
            [data?.account]
        )
    }, [enableMethod, enableText, setRefresh, data?.account])
    
    const handleCancel = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        setRefresh?.(true)
        close()
    }

    return(
        <>
            {successMessage && <FormSuccess message={successMessage} isNotif />}
            {errorMessage && <FormError message={errorMessage} isNotif />}
            <Modal
                open={open}
                onCancel={handleCancel}
                destroyOnHidden
                title={`${firstLetter(enableText)} le compte de  ${setName({firstName: data?.firstName, lastName: data?.lastName} as Individual)}`}
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
                            icon: data?.enabled ? <LuToggleRight /> : <LuToggleLeft />,
                            variant: 'solid',
                            color: data?.enabled ? 'red' : 'green',
                        }}
                    />
                </div>
            </Modal>
        </>
    )
}