import {useParams} from "react-router-dom";
import {useFetch} from "../../hooks/useFetch.ts";
import {resetPassword, validateToken} from "../../auth/services/AuthService.ts.tsx";
import {Alert, Form, Typography} from "antd";
import Responsive from "../../components/ui/layout/Responsive.tsx";
import Grid from "../../components/ui/layout/Grid.tsx";
import PageWrapper from "../../components/view/PageWrapper.tsx";
import {ModalConfirmButton} from "../../components/ui/layout/ModalConfirmButton.tsx";
import {LuLockOpen} from "react-icons/lu";
import {passwordResetRequest, ResetPasswordRequest, useName, User} from "../../auth/dto/user.ts";
import {useAuth} from "../../hooks/useAuth.ts";
import {useEffect, useMemo, useState} from "react";
import {useGlobalStore} from "../../core/global/store.ts";
import {MessageResponse} from "../../core/utils/interfaces.ts";
import TextInput from "../../components/ui/form/TextInput.tsx";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSuccess from "../../components/ui/form/FormSuccess.tsx";
import FormError from "../../components/ui/form/FormError.tsx";

function isUser(arg?: object): arg is User {
    if (!arg || typeof arg !== 'object') {
        return false;
    }

    const argProps = Object.keys(arg)

    // Check if at least one of the Params keys exists
    return argProps.some(s => s === 'username' || s === 'roles')
}

const PasswordResetPage = () => {
    const { token } = useParams()

    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)


    const {data: validateUser} = useFetch(['validate-token'], validateToken, [token], !!token)
    const setRedirectMessage = useGlobalStore(state => state.setSecurityRedirect)

    const user = useMemo(() => {
        if (isUser(validateUser)) {
            return validateUser
        }
        return undefined;
    }, [validateUser])
    
    const message = useMemo(() => {
        if (!isUser(validateUser)) {
            return validateUser as MessageResponse
        }
        return undefined
    }, [validateUser])

    const {control, formState: {errors}, handleSubmit} = useForm<ResetPasswordRequest>({
        resolver: zodResolver(passwordResetRequest)
    })

    const userName = useName(user)

    const {logoutUser} = useAuth()

    useEffect(() => {
        if (successMessage) {
            setRedirectMessage(successMessage)
        }
    }, [setRedirectMessage, successMessage]);

    const onSubmit = (data: ResetPasswordRequest) => {
        const registeredData = {...data, token: token}
        resetPassword(registeredData).then(res => {
            if (res.status === 200) {
                setSuccessMessage(res.data.message)
                //TODO envoyer un mail mot de passe réinitialiser avec succès avec un lien ce n'est pas moi
                logoutUser()
            }else {
                setErrorMessage(res.data.message)
            }
        }).catch(err => {
            err.response?.data?.message && setErrorMessage(err.response.data.message)
        })
    }

    return (
        <Form layout={'vertical'}>
            <Responsive gutter={[16, 16]} align='middle' justify='center'>
                <Grid xs={24} md={12} lg={8}>
                    <PageWrapper>
                        {(!user && message && message?.message) ? (
                            <Alert message={message?.message} type='warning' showIcon />
                        ) : (
                            <>
                                {successMessage && <FormSuccess message={successMessage} isNotif/>}
                                {errorMessage && <FormError message={errorMessage} isNotif/>}
                                <Typography.Title level={3}>Utilisateur identifié: {userName}</Typography.Title>
                                <Typography.Title level={5}>Veuillez entrer votre nouveau mot de passe</Typography.Title>
                                <TextInput.Password
                                    lg={24}
                                    label='Nouveau mot de passe'
                                    control={control}
                                    name={'newPassword'}
                                    required
                                    placeholder={"*********"}
                                    validateStatus={errors.newPassword ? 'error' : ''}
                                    help={errors.newPassword ? errors.newPassword.message : ''}
                                />
                                <ModalConfirmButton
                                    btnProps={{icon: <LuLockOpen />, type: 'primary'}}
                                    btnTxt={'Mis à jour du mot de passe'}
                                    title='Voulez vous vraiment mettre à jour votre mot de passe?'
                                    handleFunc={handleSubmit(onSubmit)}
                                />
                            </>
                        )}

                    </PageWrapper>
                </Grid>
            </Responsive>
        </Form>
    )
}

export default PasswordResetPage