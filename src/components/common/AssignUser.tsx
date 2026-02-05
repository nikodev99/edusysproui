import {assignUserToSchoolSchema, AssignUserToSchoolSchema, SignupSchema, signupSchema} from "@/schema";
import {ReactNode, useMemo, useState} from "react";
import {useUserRepo} from "@/hooks/actions/useUserRepo.ts";
import PageWrapper from "../view/PageWrapper.tsx";
import {Form, Select} from "antd";
import Responsive from "../ui/layout/Responsive.tsx";
import {Individual} from "@/entity";
import {useSearch} from "@/hooks/useSearch.ts";
import {MessageResponse} from "@/core/utils/interfaces.ts";
import {useUserAccountFlow} from "@/hooks/useUserAccountFlow.tsx";
import {IndividualType, individualTypeToUserType} from "@/entity/domain/individual.ts";
import {LuLockOpen} from "react-icons/lu";
import {ModalConfirmButton} from "../ui/layout/ModalConfirmButton.tsx";
import {UserAccountForm} from "../forms/UserAccountForm.tsx";
import {useQueryPost} from "@/hooks/usePost.ts";
import {AxiosResponse} from "axios";
import Grid from "../ui/layout/Grid.tsx";
import {ZodSchema} from "zod";
import {catchError} from "@/data/action/error_catch.ts";
import {individualOptions} from "@/core/utils/utils.ts";

export const AssignUser = (
    {setErrorMessage, setSuccessMessage}: {setErrorMessage: (errorMsg: ReactNode) => void, setSuccessMessage: (successMsg: ReactNode) => void}
) => {
    const [searchValue, setSearchValue] = useState<number | undefined>(undefined)

    const {findSearchedUserPersonalInfo} = useUserRepo()

    const {fetching, resource, options, handleSearch, handleChange} = useSearch<Individual>({
        setValue: setSearchValue as (value: unknown) => void,
        fetchFunc: findSearchedUserPersonalInfo as never,
        setCustomOptions: individualOptions,
    })

    console.log('OPTIONS: ', options)
    
    const personalInfo: Individual | undefined = useMemo(() => {
        const image = resource?.image
        if (image) {
            const cleaned = image.slice(1, -1); // Remove the brackets
            const [email, phone, enumValue] = cleaned.split(',');
            return {...resource, 
                emailId: email as string,
                telephone: phone as string,
                individualType: IndividualType[enumValue],
            }
        }
        return resource
    }, [resource])

    const {flowType, handleSubmit: handleSubmitAccountFlow, useForm, isReady} = useUserAccountFlow(
        personalInfo,
        individualTypeToUserType(IndividualType[personalInfo?.individualType as unknown as keyof typeof IndividualType]),
    )

    const schema: ZodSchema = useMemo(() => flowType === 'create' ? signupSchema : assignUserToSchoolSchema, [flowType])

    const {control, formState: {errors, submitCount}, handleSubmit} = useForm
    const {mutate} = useQueryPost(schema)

    const assignSchoolToUser = async (data: AssignUserToSchoolSchema | SignupSchema) => {
        setSuccessMessage(undefined)
        setErrorMessage(undefined)
        if (submitCount <= 0) {
            mutate({
                postFn: handleSubmitAccountFlow,
                data: data
            }, {
                onSuccess: (res: AxiosResponse<MessageResponse | SignupSchema | false>) => {
                    if (res.status === 200) {
                        if (res.data && 'message' in res.data) {
                            setSuccessMessage(res?.data?.message)
                        }else {
                            setSuccessMessage("")
                        }

                        //TODO envoyer un mail avec les identifiant ou juste pour informé l'utilisateur qu'il a désormais access à la nouvelle école.
                    }else {
                        if (res.data && 'message' in res.data) {
                            setErrorMessage(res?.data?.message)
                        }else {
                            setErrorMessage("")
                        }
                    }
                },
                onError: err => {
                    setErrorMessage(catchError(err) as string)
                }
            })
        }
    }

    return(
        <PageWrapper>
            <Responsive gutter={[16, 16]}>
                <Grid xs={24} md={24} lg={24} xxl={24} style={{marginBottom: '30px'}}>
                    <Form.Item label="Rechercher l'utilisateur" layout='vertical'>
                        <Select
                            placeholder={`Choisissez l'utilisateur à ${flowType === 'create' ? 'ajouter' : 'assigner'}`}
                            filterOption={false}
                            onSearch={handleSearch}
                            onChange={handleChange}
                            notFoundContent={fetching ? 'Loading...' : null}
                            options={options}
                            showSearch
                            value={searchValue}
                            style={{width: '100%'}}
                        />
                    </Form.Item>
                </Grid>
            </Responsive>
            <Responsive gutter={[16, 16]}>
                <Grid xs={24} md={24} lg={24} xxl={24}>
                    <Form layout='vertical'>
                        {isReady && <>
                            <UserAccountForm control={control as never} errors={errors} flowType={flowType} />
                            <ModalConfirmButton
                                btnProps={{icon: <LuLockOpen />, type: 'primary'}}
                                btnTxt={
                                    flowType === 'create'
                                        ? 'Créer le compte'
                                        : 'Affilier l\'utilisateur'
                                }
                                title={
                                    flowType === 'create'
                                        ? 'Voulez vous vraiment créer un nouveau compte pour ' + personalInfo?.lastName + ' ' + personalInfo?.firstName + ' ?'
                                        : 'Voulez vous vraiment affilier ' + personalInfo?.lastName + ' ' + personalInfo?.firstName + ' à votre école ?'
                                }
                                handleFunc={handleSubmit(assignSchoolToUser as () => never)}
                            />
                        </>}
                    </Form>
                </Grid>
            </Responsive>
        </PageWrapper>
    )
}