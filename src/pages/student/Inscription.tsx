import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {setBreadcrumb} from "../../core/breadcrumb.tsx";
import {Button, Flex, Form, Modal, Steps, Tag} from "antd";
import {useForm} from "react-hook-form";
import React, {ReactNode, useEffect, useState, useTransition} from "react";
import GuardianForm from "../../components/inscription/GuardianForm.tsx";
import {enrollmentSchema} from "../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import HealthConditionForm from "../../components/forms/HealthConditionForm.tsx";
import AttachmentForm from "../../components/inscription/AttachmentForm.tsx";
import AcademicForm from "../../components/inscription/AcademicForm.tsx";
import {useLocation} from "react-router-dom";
import queryString from 'query-string'
import {Gender} from "../../entity/enums/gender.ts";
import {Status} from "../../entity/enums/status.ts";
import {EnrollmentSchema, GuardianSchema} from "../../utils/interfaces.ts";
import {addStudent} from "../../data";
import FormError from "../../components/ui/form/FormError.tsx";
import FormSuccess from "../../components/ui/form/FormSuccess.tsx";
import {OutputFileEntry} from "@uploadcare/blocks";
import {Guardian, toGuardianSchema} from "../../entity";
import {text} from "../../utils/text_display.ts";
import PageWrapper from "../../components/ui/layout/PageWrapper.tsx";
import {redirectTo} from "../../context/RedirectContext.ts";
import StudentForm from "../../components/forms/StudentForm.tsx";
import {AddressOwner} from "../../core/shared/sharedEnums.ts";
import AddressForm from "../../components/forms/AddressForm.tsx";

const Inscription = () => {

    useDocumentTitle({
        title: "EduSysPro - Inscription",
        description: "Inscription description",
    })

    const items = setBreadcrumb([
        {
            title: text.student.label,
            path: text.student.href
        },
        {
            title: text.student.group.enroll.label
        }
    ]);

    const {handleSubmit, watch, control, formState: {errors}, setValue, trigger, reset} = useForm<EnrollmentSchema>({
        resolver: zodResolver(enrollmentSchema)
    })

    //TODO in production stop the watching
    const formData = watch()
    const setGuardianValues = (guardian: Guardian) => {
        const newGuardian: GuardianSchema = toGuardianSchema(guardian)
        setValue('student.guardian', newGuardian, {
            shouldValidate: true
        })
    }

    const [validationTriggered, setValidationTriggered] = useState(false)
    const [checked, setChecked] = useState<boolean>(true)
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [image, setImage] = useState<string | undefined>(undefined)
    const [btnLoading, setBtnLoading] = useState<boolean[]>([])
    const [guardianId, setGuardianId] = useState<string | undefined>(undefined)
    const [guardian, setGuardian] = useState<Guardian | object>({})
    const [isExists, setIsExists] = useState<boolean>(false)
    const location = useLocation()
    const [isPending, startTransition] = useTransition()
    const queryParam = queryString.parse(location.search)
    const stepNumber = Number(queryParam.step) || 0
    const current = stepNumber > 5 ? 0 : stepNumber

    const [showMaidenName, setShowMaidenName] = useState(false)
    useEffect(() => {
        const guardian = formData?.student?.guardian
        if (guardian && 'gender' in guardian && 'status' in guardian && guardian?.gender === Gender.FEMME && guardian?.status === Status.MARIE) {
            setShowMaidenName(true)
        }else {
            setShowMaidenName(false)
        }
        console.log('Error Occurred: ', errors)
        console.log('Data entered: ', formData)
    }, [errors, formData]);

    const validate = (validateFields: boolean) => {
        if (validateFields) {
            setValidationTriggered(true);
            redirectTo(`${text.student.group.enroll.href}?step=${current + 1}`)
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
                        'academicYear.id', 'classe.id'
                    ])
                    validate(validateFields)
                    break
                case 3:
                    if (guardianId && isExists) {
                        setGuardianValues(guardian as Guardian)
                        validate(true)
                    }else {
                        validateFields = await trigger([
                            "student.guardian.firstName", 'student.guardian.lastName', 'student.guardian.gender', 'student.guardian.status',
                            'student.guardian.telephone'
                        ])
                        validate(validateFields)
                    }
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

    const prev = () => redirectTo(`${text.student.group.enroll.href}?step=${current - 1}`)

    const handleUploadChange = (items?: {allEntries: OutputFileEntry[]}) => {
        const file = items?.allEntries[0]
        if (file && file.status === 'success' && file.cdnUrl && file.name) {
            setImage(`${file.cdnUrl}${file.name}`)
        }
    }

    const onConfirmModal = (index: number) => {
        setBtnLoading((prevLoading) => {
            const newLoading = [...prevLoading]
            newLoading[index] = true
            return newLoading
        })
        setTimeout(() => {
            setBtnLoading((prevLoading) => {
                const newLoading = [...prevLoading]
                newLoading[index] = false
                return newLoading
            })
            Modal.confirm({
                title: 'Poursuivre ?',
                content: 'Souhaitez vous vraiment poursuivre avec l\'inscription ?',
                okText: 'Confirmer',
                cancelText: 'Annuler',
                onOk: () => handleSubmit(onSubmit)()
            })
        }, 2000)
    }

    const onSubmit = (data: EnrollmentSchema) => {
        setError("")
        setSuccess("")

        startTransition(() => {

        if (checked && !guardianId && !isExists) {
            data = {
                ...data,
                student: {
                    ...data.student,
                    guardian: {
                        ...data.student.guardian,
                        address: data.student.address
                    }
                }
            }
        }

        if (image) data = {...data, student: {...data.student, image: image}}

        data = {
            ...data,
            student: {
                ...data.student,
                reference: 'AMB000005'
            }
        }

        addStudent(data)
            .then((res) => {
                setError(res?.error)
                if (res.isSuccess) {
                    setSuccess(res?.success)
                    reset()
                }
            })
        })
    }

    const clickToUnchecked = () => {
        setChecked(!checked)
    }

    const steps = [
        {
            title: 'Individuelle',
            content: <StudentForm control={control} errors={errors} edit={false} enroll={true} />
        },
        {
            title: 'Adresse',
            content: <AddressForm
                enroll={true}
                control={control}
                type={AddressOwner.STUDENT}
                edit={false}
                errors={errors}
                validationTriggered={validationTriggered}
            />
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
                value={guardianId}
                setValue={setGuardianId}
                isExists={isExists}
                setIsExists={setIsExists}
                guardian={guardian as Guardian}
                setGuardian={setGuardian}
            />
        },
        {
            title: 'Santé',
            content: <HealthConditionForm control={control} errors={errors} edit={false} enroll={true} />
        },
        {
            title: 'Attachements',
            content: <AttachmentForm imageCdn={image}  onChange={handleUploadChange}/>
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
            <PageHierarchy items={items as [{title: string|ReactNode, path?: string}]}/>
            <PageWrapper>
                <Flex className='inscription-wrapper' vertical>
                    <div className='form-wrapper'>
                        <Form layout="vertical" initialValues={{requiredMarkValue: 'customize'}} requiredMark={requiredMark} onFinish={handleSubmit(onSubmit)}>
                            <div className="step-wrapper">
                                <Steps current={current} items={stepItems}/>
                            </div>
                            {steps[current].content}
                            {error && (<FormError message={error}/>)}
                            {success && (<FormSuccess message={success}/>)}
                            <Flex gap='small'>
                                {current > 0 && (
                                    <Button onClick={prev}>précédent</Button>
                                )}
                                {current < steps.length - 1 && (
                                    <Button type='primary' onClick={next}>Suivant</Button>
                                )}
                                {current === steps.length - 1 && (
                                    <Button disabled={isPending} type='primary' loading={btnLoading[0]} onClick={() => {
                                        onConfirmModal(0)
                                    }}>Terminer</Button>
                                )}
                            </Flex>
                        </Form>
                    </div>
                </Flex>
            </PageWrapper>
        </>

    )
}

export default Inscription
