import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {setBreadcrumb} from "../../utils/breadcrumb.tsx";
import {Button, Flex, Form, Steps, Tag} from "antd";
import {useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import IndividualForm from "../../components/inscription/IndividualForm.tsx";
import StudentAddressForm from "../../components/inscription/StudentAddressForm.tsx";
import GuardianForm from "../../components/inscription/GuardianForm.tsx";
import {z} from "zod";
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

    const onSubmit = (data: z.infer<typeof enrollmentSchema>) => {
        console.log(data)
    }

    const [validationTriggered, setValidationTriggered] = useState(false)
    const location = useLocation()
    const queryParam = queryString.parse(location.search)
    const current = Number(queryParam.step) || 0
    const navigate = useNavigate()

    const [showMaidenName, setShowMaidenName] = useState(false)
    useEffect(() => {
        console.log(formData)
        if (formData?.student?.guardian?.gender === Gender.FEMME && formData?.student?.guardian?.status === Status.MARIE) {
            setShowMaidenName(true)
        }else {
            setShowMaidenName(false)
        }
    }, [formData]);

    const next = async () => {
        navigate(`/students/new?step=${current + 1}`)
        /*let validateFields;
        try {
            switch (current) {
                case 0:
                    validateFields = await trigger([
                        'lastName', 'firstName', 'gender', 'dadName', 'momName', 'birthCity', 'birthDate', 'nationality'
                    ])
                    validate(validateFields)
                    break
                case 1:
                    validateFields = await trigger()
                    validate(validateFields)
            }
        }catch (err) {
            console.error('Validation failed:', err);
        }*/
    }

    const validate = (validateFields: boolean) => {
        if (validateFields) {
            setValidationTriggered(true);
            navigate(`/students/new?step=${current + 1}`)
        }
    }

    const prev = () => navigate(`/students/new?step=${current - 1}`)

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
            content: <GuardianForm control={control} errors={errors} validationTriggered={validationTriggered} showField={showMaidenName} />
        },
        {
            title: 'Santé',
            content: <HealthConditionForm />
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
                        <Flex gap='small'>
                            {current > 0 && (
                                <Button onClick={prev}>précédent</Button>
                            )}
                            {current < steps.length - 1 && (
                                <Button type='primary' onClick={next}>Suivant</Button>
                            )}
                            {current === steps.length - 1 && (
                                <Button type='primary' htmlType='submit'>Terminer</Button>
                            )}
                        </Flex>
                    </Form>
                </div>
            </Flex>
        </>

    )
}

export default Inscription