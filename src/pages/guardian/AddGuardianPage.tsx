import {GuardianForm} from "@/components/ui-kit-student";
import {useToggle} from "@/hooks/useToggle.ts";
import {useEffect, useState} from "react";
import {Guardian, toGuardianSchema} from "@/entity";
import {useForm} from "react-hook-form";
import {guardianSchema, GuardianSchema} from "@/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import OutletPage from "@/pages/OutletPage.tsx";
import {Button, Form, Space} from "antd";
import {useRedirect} from "@/hooks/useRedirect.ts";
import PageWrapper from "@/components/view/PageWrapper.tsx";
import {useSearchParams} from "react-router-dom";
import {ModalConfirmButton} from "@/components/ui/layout/ModalConfirmButton.tsx";
import {useStudentRepo} from "@/hooks/actions/useStudentRepo.ts";
import {useQueryUpdate} from "@/hooks/useUpdate.ts";
import {changeGuardian} from "@/data/repository/guardianRepository.ts";
import {catchError} from "@/data/action/error_catch.ts";
import {getSlug} from "@/core/utils/utils.ts";

const AddGuardianPage = () => {
    const [checked, setChecked] = useToggle(false)
    const [guardianId, setGuardianId] = useState<string | undefined>(undefined)
    const [guardian, setGuardian] = useState<Guardian>({} as Guardian)
    const [responseData, setResponseData] = useState<Guardian | undefined>(undefined)
    const [isExists, setIsExists] = useState<boolean>(false)
    const [successMessage, setSuccessMessage] = useState<string | undefined>("")
    const [errorMessage, setErrorMessage] = useState<string | undefined>("")
    const {useGetStudentAddress} = useStudentRepo()
    const [param] = useSearchParams()

    const studentId = param.get('student')
    const address = useGetStudentAddress((checked && !guardianId && !isExists && studentId) ? studentId : undefined)
    
    const {toGuardian, toViewGuardian, toViewStudent} = useRedirect()

    const {control, formState: {errors}, handleSubmit, setValue, reset, watch} = useForm<GuardianSchema>({
        resolver: zodResolver(guardianSchema)
    })

    const {mutate} = useQueryUpdate(guardianSchema)

    useEffect(() => {
        if (checked && !guardianId && !isExists && address) {
            setValue('personalInfo.address.number', address?.number)
            setValue('personalInfo.address.street', address?.street)
            setValue('personalInfo.address.secondStreet', address?.secondStreet)
            setValue('personalInfo.address.neighborhood', address?.neighborhood)
            setValue('personalInfo.address.borough', address?.borough)
            setValue('personalInfo.address.city', address?.city)
            setValue('personalInfo.address.zipCode', address?.zipCode)
            setValue('personalInfo.address.country', address?.country)
        }
    }, [address, checked, guardianId, isExists, setValue]);


    useEffect(() => {
        if (guardianId && isExists && guardian) {
            reset(toGuardianSchema(guardian))
        }
    }, [guardian, guardianId, isExists, reset]);

    const onSubmit = (data: GuardianSchema) => {
        setSuccessMessage(undefined)
        mutate({
            putFn: changeGuardian as never,
            data: data,
            id: studentId as string
        }, {
            onSuccess: response => {
                if (response && response.data) {
                    setResponseData(response.data as Guardian)
                }
                setSuccessMessage(isExists ? "Nouveau tuteur assigné à l'élève" : "Nouveau tuteur ajouté et assigné à l'élève")
            },
            onError: (error) => setErrorMessage(catchError(error) as string)
        })
    }

    console.log("DATA: ", watch())
    console.log("ERROR: ", errors)

    const handleRedirect = () => {
        console.log("redirect...")
        return toViewGuardian(responseData?.id as string, getSlug({personalInfo: responseData?.personalInfo}))
    }

    return(
        <OutletPage
            metadata={{
                title: 'Ajouter tuteur',
                description: 'Ajouter un tuteur description'
            }}
            breadCrumb={{
                bCItems: [
                    {title: 'Tuteurs', setRedirect: toGuardian},
                    {title: 'Ajouter tuteur'}
                ]
            }}
            responseMessages={{
                success: successMessage,
                error: errorMessage
            }}
            setRedirect={handleRedirect}
            content={
            <PageWrapper>
                <Form layout='vertical'>
                    <GuardianForm
                        checked={checked}
                        onChecked={setChecked}
                        setValue={setGuardianId}
                        value={guardianId}
                        isExists={isExists}
                        setIsExists={setIsExists}
                        guardian={guardian as Guardian}
                        setGuardian={setGuardian}
                        control={control as never}
                        errors={errors}
                        parents={{
                            guardian: '',
                            personalInfo: 'personalInfo',
                            address: 'personalInfo.address'
                        }}
                    />
                    <Space style={{marginTop: '20px'}}>
                        <Button
                            variant='solid'
                            danger
                            onClick={() => toViewStudent(studentId as string)}
                        >
                            Annuler
                        </Button>
                        <ModalConfirmButton
                            handleFunc={handleSubmit(onSubmit)}
                            btnTxt={'Mettre à jour'}
                            btnProps={{
                                type: 'primary',
                            }}
                        />
                    </Space>
                </Form>
            </PageWrapper>
        } />
    )
}

export default AddGuardianPage