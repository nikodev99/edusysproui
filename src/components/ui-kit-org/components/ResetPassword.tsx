import {User} from "@/auth/dto/user.ts";
import {setName} from "@/core/utils/utils.ts";
import {Individual} from "@/entity";
import {LuRotateCcw} from "react-icons/lu";
import {useState} from "react";
import {ConfirmationModal} from "@/components/ui/layout/ConfirmationModal.tsx";
import {resetPasswordRequest} from "@/auth/services/AuthService.ts.tsx";
import {useUserRepo} from "@/hooks/actions/useUserRepo.ts";
import {ActionDrawer} from "@/core/utils/interfaces.ts";

export const ResetPassword = ({data, open, close}: ActionDrawer<User>) => {
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const {saveActivity} = useUserRepo()

    const handleSendTokenEMail = async () => {
        await resetPasswordRequest(data?.id).then(res => {
            if (res.status === 200) {
                setSuccessMessage(res.data.message)
                saveActivity({
                    action: 'Demande de réinitialisation de mot de passe',
                    description: res?.data?.description
                })
            }
        })
    }

    const handleCancel = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        close()
    }

    return(
        <ConfirmationModal
            data={data}
            open={open}
            close={handleCancel}
            handleFunc={handleSendTokenEMail}
            modalTitle={user => `Réinitialiser le mot de passe de ${setName({firstName: user?.firstName, lastName: user?.lastName} as Individual)}`}
            alertDesc={{
                type: 'warning',
                msg: "Vous êtes sur le point d'envoyer un mail avec un token sécurisé pour réinitialiser le mot de passe du compte."
            }}
            messages={{success: successMessage, error: errorMessage}}
            title='Souhaitez vous poursuivre ?'
            content={`Veuillez cliquer sur OUI pour initier la réinitialisation du mot de passe`}
            btnTxt={'Réinitialiser'}
            btnProps={{
                icon: <LuRotateCcw />,
                type: 'default',
                danger: true,
                variant: 'solid'
            }}
            justify='center'
        />
    )
}