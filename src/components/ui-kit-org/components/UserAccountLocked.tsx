import {User} from "../../../auth/dto/user.ts";
import {useCallback, useMemo, useState} from "react";
import {setLockAccount, setUnlockAccount} from "../../../data/repository/userRepository.ts";
import {PatchUpdate} from "../../../core/PatchUpdate.ts";
import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";
import {Alert, Modal} from "antd";
import {firstLetter, setName} from "../../../core/utils/utils.ts";
import {Individual} from "../../../entity";
import {ModalConfirmButton} from "../../ui/layout/ModalConfirmButton.tsx";
import {LuLock, LuLockOpen} from "react-icons/lu";

export const UserAccountLocked = ({user, open, close, setRefetch}: {
    user: User,
    open: boolean,
    close: () => void,
    setRefetch?: (refetch: boolean) => void
}) => {
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const lockedText = useMemo(() => user?.accountNonLocked ? 'vérrouiller' : 'déverrouiller', [user?.accountNonLocked])
    const lockedCons = useMemo(() => user?.accountNonLocked
            ? "Le verrouillage empêche immédiatement l'utilisateur de se connecter et suspend ses actions/notifications"
            : "Déverrouiller et restaurer accès et ses permissions normales à l'utilisateur",
        [user?.accountNonLocked]
    )

    const lockedMethod = useCallback((accountId: number) =>
        user?.accountNonLocked ? setUnlockAccount(accountId) : setLockAccount(accountId), [user?.accountNonLocked])

    const handleFinish = useCallback(async () => {
        setRefetch?.(false)
        await PatchUpdate.setWithCustom(
            lockedMethod as () => Promise<never> ,
            () => setSuccessMessage(`Le compte a été ${lockedText} avec succès!!`),
            setErrorMessage,
            [user?.account]
        )
    }, [lockedMethod, lockedText, setRefetch, user?.account])

    const handleCancel = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        setRefetch?.(true)
        close()
    }

    return(
        <>
            {successMessage && <FormSuccess message={successMessage} />}
            {errorMessage && <FormError message={errorMessage} />}
            <Modal
                open={open}
                onCancel={handleCancel}
                destroyOnClose
                title={`${firstLetter(lockedText)} le compte de  ${setName({firstName: user?.firstName, lastName: user?.lastName} as Individual)}`}
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
                            icon: user?.accountNonLocked ? <LuLock /> : <LuLockOpen />,
                            variant: 'solid',
                            color: user?.accountNonLocked ? 'red' : 'green',
                        }}
                    />
                </div>
            </Modal>
        </>
    )
}