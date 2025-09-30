import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";
import {Alert, Modal} from "antd";
import {ModalConfirmButton} from "../../ui/layout/ModalConfirmButton.tsx";
import {useCallback, useMemo, useState} from "react";
import {sessionLogout} from "../../../data/repository/userRepository.ts";
import {isAxiosError} from "axios";
import {LuLogOut} from "react-icons/lu";
import {useAuth} from "../../../hooks/useAuth.ts";

export const SessionLogout = ({sessionId, open, close, isCurrent, setRefetch}: {
    sessionId: number,
    open: boolean,
    close: () => void,
    isCurrent?: boolean
    setRefetch?: (refetch: boolean) => void
}) => {
    const {logoutUser} = useAuth()
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const enableCons = useMemo(() =>
            "Vous êtes sur le point de vous déconnecter. " +
            "Voulez-vous vraiment vous déconnecté de cette session votre session ?"
        ,[])

    const onLogout = useCallback(async () => {
        setRefetch?.(false);
        await sessionLogout(sessionId).then(res => {
            if (res.status === 200)
                setSuccessMessage(res?.data?.message)
            else
                setErrorMessage(res?.data?.message)
        }).catch(error => {
            if(isAxiosError(error)) {
                setErrorMessage(error?.response?.data?.message)
            }else {
                setErrorMessage(JSON.stringify(error))
            }
        })
    }, [sessionId, setRefetch])


    const handleCancel = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        if (isCurrent && isCurrent) {
            logoutUser()
        }else {
            setRefetch?.(true)
        }
        close()
    }
    return(
        <>
            {successMessage && <FormSuccess message={successMessage} />}
            {errorMessage && <FormError message={errorMessage} isNotif />}
            <Modal
                open={open}
                onCancel={handleCancel}
                destroyOnClose
                title={'Se déconnecter de la session'}
                footer={null}
            >
                {successMessage && <Alert type={'success'} message={successMessage} closeIcon showIcon style={{marginBottom: '10px'}} />}
                {errorMessage && <Alert type={'error'} message={errorMessage} closeIcon showIcon style={{marginBottom: '10px'}} />}
                <Alert type='warning' style={{marginBottom: '15px'}} message={enableCons} showIcon />
                <div style={{textAlign: 'center'}}>
                    <ModalConfirmButton
                        handleFunc={onLogout}
                        title='Souhaitez vous poursuivre ?'
                        content={`Veuillez cliquer sur OUI pour unilateralement se déconnecter de cette session`}
                        tooltipTxt={`Cliquer pour vous déconnecter`}
                        btnTxt={'Déconnexion'}
                        btnProps={{
                            icon: <LuLogOut />,
                            type: 'default',
                            danger: true
                        }}
                    />
                </div>
            </Modal>
        </>
    )
}