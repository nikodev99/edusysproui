import {User} from "@/auth/dto/user.ts";
import {useCallback, useMemo, useState} from "react";
import {setLockAccount, setUnlockAccount} from "@/data/repository/userRepository.ts";
import {PatchUpdate} from "@/core/PatchUpdate.ts";
import FormSuccess from "@/components/ui/form/FormSuccess.tsx";
import FormError from "@/components/ui/form/FormError.tsx";
import {Alert, Modal} from "antd";
import {firstLetter, setName} from "@/core/utils/utils.ts";
import {Individual} from "@/entity";
import {ModalConfirmButton} from "@/components/ui/layout/ModalConfirmButton.tsx";
import {LuLock, LuLockOpen} from "react-icons/lu";
import {ActionDrawer} from "@/core/utils/interfaces.ts";

export const UserAccountLocked = ({data, open, close, setRefresh}: ActionDrawer<User>) => {
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const lockedText = useMemo(() => data?.accountNonLocked ? 'vérrouiller' : 'déverrouiller', [data?.accountNonLocked])
    const lockedCons = useMemo(() => data?.accountNonLocked
            ? "Le verrouillage empêche immédiatement l'utilisateur de se connecter et suspend ses actions/notifications"
            : "Déverrouiller et restaurer accès et ses permissions normales à l'utilisateur",
        [data?.accountNonLocked]
    )

    const lockedMethod = useCallback((accountId: number) =>
        data?.accountNonLocked ? setUnlockAccount(accountId) : setLockAccount(accountId), [data?.accountNonLocked])

    const handleFinish = useCallback(async () => {
        setRefresh?.(false)
        await PatchUpdate.setWithCustom(
            lockedMethod as () => Promise<never> ,
            () => setSuccessMessage(`Le compte a été ${lockedText} avec succès!!`),
            setErrorMessage,
            [data?.account]
        )
    }, [lockedMethod, lockedText, setRefresh, data?.account])

    const handleCancel = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        setRefresh?.(true)
        close()
    }

    return(
        <>
            {successMessage && <FormSuccess message={successMessage} />}
            {errorMessage && <FormError message={errorMessage} />}
            <Modal
                open={open}
                onCancel={handleCancel}
                destroyOnHidden
                title={`${firstLetter(lockedText)} le compte de  ${setName({firstName: data?.firstName, lastName: data?.lastName} as Individual)}`}
                footer={null}
            >
                {successMessage && <Alert type={'success'} message={successMessage} closeIcon showIcon style={{marginBottom: '10px'}} />}
                {errorMessage && <Alert type={'error'} message={errorMessage} closeIcon showIcon style={{marginBottom: '10px'}} />}
                <Alert style={{marginBottom: '15px'}} message={lockedCons} showIcon />
                <div style={{textAlign: 'center'}}>
                    <ModalConfirmButton
                        handleFunc={handleFinish}
                        title='Souhaitez vous poursuivre ?'
                        content={`Veuillez cliquer sur OUI pour ${lockedText} le compte`}
                        tooltipTxt={`Cliquer pour ${lockedText}`}
                        btnTxt={firstLetter(lockedText)}
                        btnProps={{
                            icon: data?.accountNonLocked ? <LuLock /> : <LuLockOpen />,
                            variant: 'solid',
                            color: data?.accountNonLocked ? 'red' : 'green',
                        }}
                    />
                </div>
            </Modal>
        </>
    )
}