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
import {useMemo, useState} from "react";
import {useGlobalStore} from "../../core/global/store.ts";
import {MessageResponse} from "../../core/utils/interfaces.ts";
import TextInput from "../../components/ui/form/TextInput.tsx";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSuccess from "../../components/ui/form/FormSuccess.tsx";
import FormError from "../../components/ui/form/FormError.tsx";
import {useQueryPost} from "../../hooks/usePost.ts";
import {catchError} from "../../data/action/error_catch.ts";
import {redirectTo} from "../../context/RedirectContext.ts";

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
    const {mutate} = useQueryPost(passwordResetRequest)

    const clearMessages = () => {
        setErrorMessage(undefined);
        setSuccessMessage(undefined);
    };

    const onSubmit = (data: ResetPasswordRequest) => {
        clearMessages()
        const registeredData = {...data, token: token}

        mutate({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            postFn: resetPassword,
            data: registeredData,
        }, {
            onSuccess: response => {
                if (response.status === 200 && response.data && 'message' in response.data) {
                    setSuccessMessage(response?.data?.message as string);
                    setRedirectMessage(response?.data?.message as string)
                    logoutUser()
                }
            },
            onError: error => {
                const errorMsg = catchError(error) as string;
                setErrorMessage(errorMsg as string);
            },
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
                                {successMessage && <FormSuccess message={successMessage} setRedirect={() => redirectTo('/login')} isNotif/>}
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