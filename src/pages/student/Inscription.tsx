import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {setBreadcrumb} from "../../utils/breadcrumb.tsx";
import {Button, Flex, Form, Steps, Tag} from "antd";
import {useForm} from "react-hook-form";
import React, {useEffect, useState, useTransition} from "react";
import IndividualForm from "../../components/inscription/IndividualForm.tsx";
import StudentAddressForm from "../../components/inscription/StudentAddressForm.tsx";
import GuardianForm from "../../components/inscription/GuardianForm.tsx";
import {enrollmentSchema} from "../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import HealthConditionForm from "../../components/inscription/HealthConditionForm.tsx";
import AttachmentForm from "../../components/inscription/AttachmentForm.tsx";
import AcademicForm from "../../components/inscription/AcademicForm.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import queryString from 'query-string'
import {Gender} from "../../entity/enums/gender.ts";
import {Status} from "../../entity/enums/status.ts";
import {EnrollmentSchema} from "../../utils/interfaces.ts";
import {addStudent} from "../../data/action/enrollStudent.ts";
import FormError from "../../components/ui/form/FormError.tsx";
import FormSuccess from "../../components/ui/form/FormSuccess.tsx";

const Inscription = () => {

    useDocumentTitle({
        title: "EduSysPro - Inscription",
        description: "Inscription description",
    })

    const items = setBreadcrumb([{
        title: 'Inscription'
    }])

    const {handleSubmit, watch, control, formState: {errors}, trigger} = useForm<EnrollmentSchema>({
        resolver: zodResolver(enrollmentSchema),
    })

    //TODO in production stop the watching
    const formData = watch()

    const [validationTriggered, setValidationTriggered] = useState(false)
    const [checked, setChecked] = useState<boolean>(true)
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const location = useLocation()
    const navigate = useNavigate()
    const [isPending, startTransition] = useTransition()
    const queryParam = queryString.parse(location.search)
    const stepNumber = Number(queryParam.step) || 0
    const current = stepNumber > 5 ? 0 : stepNumber

    const [showMaidenName, setShowMaidenName] = useState(false)
    useEffect(() => {
        //console.log(formData)
        if (formData?.student?.guardian?.gender === Gender.FEMME && formData?.student?.guardian?.status === Status.MARIE) {
            setShowMaidenName(true)
        }else {
            setShowMaidenName(false)
        }
    }, [formData]);

    const validate = (validateFields: boolean) => {
        if (validateFields) {
            setValidationTriggered(true);
            navigate(`/students/new?step=${current + 1}`)
        }
    }

    const next = async () => {
        let validateFields;
        try {
            switch (current) {
                case 0:
                    validateFields = await trigger([
                        'student.lastName', 'student.firstName', 'student.gender', 'student.dadName', 'student.momName',
                        'student.birthCity', 'student.birthDate', 'student.nationality'
                    ])
                    validate(validateFields)
                    break
                case 1:
                    validateFields = await trigger([
                        'student.address.number', 'student.address.street', 'student.address.neighborhood', 'student.address.city',
                        'student.address.country'
                    ])
                    validate(validateFields)
                    break
                case 2:
                    validateFields = await trigger([
                        'academicYear', 'classe.id'
                    ])
                    validate(validateFields)
                    break
                case 3:
                    validateFields = await trigger([
                        "student.guardian.firstName", 'student.guardian.lastName', 'student.guardian.gender', 'student.guardian.status',
                        'student.guardian.telephone'
                    ])
                    validate(validateFields)
                    break
                case 4:
                    validateFields = await trigger([
                        'student.healthCondition.bloodType', 'student.healthCondition.weight', 'student.healthCondition.height'
                    ])
                    validate(validateFields)
                    break
            }
        }catch (err) {
            console.error('Validation failed:', err);
        }
    }

    const prev = () => navigate(`/students/new?step=${current - 1}`)

    const uploadFiles = (data: EnrollmentSchema) => {
        console.log('show me data: ', data)
    }

    const onSubmit = (data: EnrollmentSchema) => {
        console.log('clicked')
        setError("")
        setSuccess("")

        startTransition(() => {
            addStudent(data)
                .then((res) => {
                    setError(res?.error)
                    setSuccess(res?.success)
                })
        })
    }

    const clickToUnchecked = () => {
        console.log('clicked')
        setChecked(!checked)
    }

    const steps = [
        {
            title: 'Individuelle',
            content: <IndividualForm control={control} errors={errors} validationTriggered={validationTriggered} />
        },
        {
            title: 'Adresse',
            content: <StudentAddressForm control={control} errors={errors} validationTriggered={validationTriggered} />
        },
        {
            title: 'Scolarité',
            content: <AcademicForm control={control} errors={errors} validationTriggered={validationTriggered} />
        },
        {
            title: 'Tuteur',
            content: <GuardianForm
                control={control}
                errors={errors}
                validationTriggered={validationTriggered}
                showField={showMaidenName}
                checked={checked}
                onChecked={clickToUnchecked}
            />
        },
        {
            title: 'Santé',
            content: <HealthConditionForm control={control} errors={errors} />
        },
        {
            title: 'Attachements',
            content: <AttachmentForm />
        }
    ]

    const stepItems = steps.map((item) => ({key: item.title, title: item.title}))

    const requiredMark = (label: React.ReactNode, {required}: {required: boolean}) => (
        <>
            {required ? <Tag color='error'>requis</Tag> : <Tag color='warning'>optionnel</Tag>}
            {label}
        </>
    )

    return(
        <>
            <PageHierarchy items={items}/>
            <Flex className='inscription-wrapper' vertical>
                <div className="step-wrapper">
                    <Steps current={current} items={stepItems} />
                </div>
                <div className='form-wrapper'>
                    <Form layout="vertical" initialValues={{requiredMarkValue: 'customize'}} requiredMark={requiredMark} onFinish={handleSubmit(onSubmit)}>
                        {steps[current].content}
                        {error && (<FormError message={error} />)}
                        {success && (<FormSuccess message={success} />)}
                        <Flex gap='small'>
                            {current > 0 && (
                                <Button onClick={prev}>précédent</Button>
                            )}
                            {current < steps.length - 1 && (
                                <Button type='primary' onClick={next}>Suivant</Button>
                            )}
                            {current === steps.length - 1 && (
                                <Button disabled={isPending} type='primary' htmlType='submit'>Terminer</Button>
                            )}
                        </Flex>
                    </Form>
                </div>
            </Flex>
        </>

    )
}

export default Inscription