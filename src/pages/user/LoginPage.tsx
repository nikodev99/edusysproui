import {LoginForm} from "../../components/forms/LoginForm.tsx";
import {useForm} from "react-hook-form";
import {Alert, Button, Card, Form} from "antd";
import {zodResolver} from "@hookform/resolvers/zod";
import {LoginSchema, loginSchema} from "../../schema";
import {useAuth} from "../../hooks/useAuth.ts";
import {useQueryPost} from "../../hooks/usePost.ts";
import React from "react";

const LoginPage = () => {
    const { loginUser, loginError, clearLoginError } = useAuth()

    const {control, formState: {errors}, handleSubmit, watch} = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    })

    const {mutate} = useQueryPost(loginSchema)

    const onSubmit = (data: LoginSchema) => {
        mutate({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            postFn: loginUser,
            data: data
        })
    }

    const handleLogin = handleSubmit(onSubmit)

    const handleKeyDownSubmit = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleLogin().then()
        }
    }

    console.log("WATCHER: ", watch())
    console.log("ERROE MESSAGE: ", loginError)

    return(
        <div className='login__page__wrapper'>
            <div className="login__page__logo__wrapper">
                <img src="/edusyspro.svg" alt="logo" className="login__page__logo"/>
            </div>
            <Card title="Connexion" bordered={false} className="login__page__card">
                {loginError && (
                    <Alert
                        message="Authentication Error"
                        description={loginError}
                        type="error"
                        showIcon
                        closable
                        onClose={clearLoginError}
                        style={{ marginBottom: 16 }}
                    />
                )}
                <Form autoComplete='off' layout='vertical' onKeyDown={handleKeyDownSubmit}>
                    <LoginForm control={control} errors={errors} />

                    <Form.Item>
                        <Button type='primary' onClick={handleLogin}>Se connecter</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default LoginPage;