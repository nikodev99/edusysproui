import OutletPage from "../OutletPage.tsx";
import {text} from "../../core/utils/text_display.ts";
import {getSlug} from "../../core/utils/utils.ts";
import {useParams} from "react-router-dom";
import {useUserRepo} from "../../hooks/actions/useUserRepo.ts";
import {useEffect, useMemo, useState} from "react";
import {ChangePasswordRequest, passwordChangeRequest, useName} from "../../auth/dto/user.ts";
import {Form} from "antd";
import {ChangePasswordForm} from "../../components/forms/ChangePasswordForm.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Responsive from "../../components/ui/layout/Responsive.tsx";
import Grid from "../../components/ui/layout/Grid.tsx";
import {changePassword} from "../../data/repository/userRepository.ts";
import {ModalConfirmButton} from "../../components/ui/layout/ModalConfirmButton.tsx";
import {LuLockOpen} from "react-icons/lu";
import PageWrapper from "../../components/view/PageWrapper.tsx";
import {useAuth} from "../../hooks/useAuth.ts";
import {useGlobalStore} from "../../core/global/store.ts";

const ChangePasswordPage = () => {

    const {id} = useParams()

    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const userId = useMemo(() => Number(id), [id])

    const {useGetUser} = useUserRepo()
    const setRedirectMessage = useGlobalStore(state => state.setSecurityRedirect)
    const {data: user} = useGetUser(userId)
    const userName = useName(user)

    const {logoutUser} = useAuth()

    const {control, formState: {errors}, handleSubmit} = useForm<ChangePasswordRequest>({
        resolver: zodResolver(passwordChangeRequest)
    })

    useEffect(() => {
        if (successMessage) {
           setRedirectMessage(successMessage)
        }
    }, [setRedirectMessage, successMessage]);

    const onSubmit = (data: ChangePasswordRequest) => {
        setSuccessMessage(undefined)
        setErrorMessage(undefined)
        const registeredData = {...data, userId: userId}
        console.log('registeredData: ', registeredData)
        changePassword(registeredData).then(res => {
            if (res.status === 200) {
                setSuccessMessage(res.data.message)
                //TODO envoyer un mail avec un lien ce n'est pas moi
                logoutUser()
            }else {
                setErrorMessage(res.data.message)
            }
        }).catch(err => {
            err.response?.data?.message && setErrorMessage(err.response.data.message)
        })
    }

    console.log('ERROR: ', errors)

    return <OutletPage
        metadata={{title: 'Change mot de passe', description: 'Changez votre mot de passe.'}}
        breadCrumb={{
            bCItems: [
                {title: text.org.group.school.label, path: text.org.group.school.href},
                {title: text.org.group.user.label, path: text.org.group.user.href},
                {
                    title: userName,
                    path: text.org.group.user.view.href + getSlug({firstName: user?.firstName, lastName: user?.lastName}),
                    state: userId
                },
                {title: 'Changer Mot de Passe'}
            ],
            mBottom: 80
        }}
        responseMessages={{
            success: successMessage,
            error: errorMessage
        }}
        content={
        <Form layout={'vertical'}>
            <Responsive gutter={[16, 16]} align='middle' justify='center'>
                <Grid xs={24} md={12} lg={8}>
                    <PageWrapper>
                        <ChangePasswordForm control={control} errors={errors} />
                        <ModalConfirmButton
                            btnProps={{icon: <LuLockOpen />, type: 'primary'}}
                            btnTxt={'Changer mot de passe'}
                            title='Voulez vous vraiment changer votre mot de passe?'
                            handleFunc={handleSubmit(onSubmit)}
                        />
                    </PageWrapper>
                </Grid>
            </Responsive>
        </Form>
    } />
}

export default ChangePasswordPage;