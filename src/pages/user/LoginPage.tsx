import {LoginForm} from "../../components/forms/LoginForm.tsx";
import {useForm} from "react-hook-form";
import {Alert, Button, Card, Form, Typography} from "antd";
import {zodResolver} from "@hookform/resolvers/zod";
import {LoginSchema, loginSchema} from "../../schema";
import {useAuth} from "../../hooks/useAuth.ts";
import {useQueryPost} from "../../hooks/usePost.ts";
import React from "react";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {useGlobalStore} from "../../core/global/store.ts";

const LoginPage = () => {
    useDocumentTitle({
        title: "Connexion",
        description: "Connexion description",
    })

    const { loginUser, loginError, clearLoginError } = useAuth()
    const redirectMessage = useGlobalStore(state => state.securityRedirect)
    const setRedirectMessage = useGlobalStore(state => state.setSecurityRedirect)

    const {control, formState: {errors}, handleSubmit} = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    })

    const {mutate} = useQueryPost(loginSchema)

    const onSubmit = (data: LoginSchema) => {
        setRedirectMessage('')
        mutate({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            postFn: loginUser,
            data: data
        })
    }

    const clearSecurityMessage = () => setRedirectMessage('')

    const handleLogin = handleSubmit(onSubmit)

    const handleKeyDownSubmit = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleLogin().then()
        }
    }

    return(
        <div className='login__page__wrapper'>
            <div className="login__page__logo__wrapper">
                <img src="/edusyspro.svg" alt="logo" className="login__page__logo"/>
            </div>
            <Card title="Connexion" bordered={false} className="login__page__card">
                {loginError?.message && (
                    <Alert
                        message={loginError.type ?? "Authentication Error"}
                        description={loginError?.message}
                        type="error"
                        showIcon
                        closable
                        onClose={clearLoginError}
                        style={{ marginBottom: 16 }}
                    />
                )}
                {redirectMessage && (
                    <Alert
                        message={"Problème de sécurité"}
                        description={redirectMessage}
                        type="info"
                        showIcon
                        closable
                        onClose={clearSecurityMessage}
                        style={{ marginBottom: 16 }}
                    />
                )}
                <Form autoComplete='off' layout='vertical' onKeyDown={handleKeyDownSubmit}>
                    <LoginForm control={control} errors={errors} />

                    <Form.Item>
                        <Button type='primary' onClick={handleLogin}>Se connecter</Button>
                    </Form.Item>
                </Form>
                <Typography.Link onClick={() => alert('Cliqué ici pour demandé la réinitialisation de votre mot de passe')}>Mot de passe oublié</Typography.Link>
            </Card>
        </div>
    )
}

export default LoginPage;