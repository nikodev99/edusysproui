import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {setBreadcrumb} from "../../utils/breadcrumb.tsx";
import {Button, Flex, Form, Steps, Tag} from "antd";
import {useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import IndividualForm from "../../components/inscription/IndividualForm.tsx";
import AddressForm from "../../components/inscription/AddressForm.tsx";
import GuardianForm from "../../components/inscription/GuardianForm.tsx";
import {z} from "zod";
import {inscriptionSchema} from "../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import HealthConditionForm from "../../components/inscription/HealthConditionForm.tsx";
import AttachmentForm from "../../components/inscription/AttachmentForm.tsx";
import AcademicForm from "../../components/inscription/AcademicForm.tsx";

const Inscription = () => {

    useDocumentTitle({
        title: "EduSysPro - Inscription",
        description: "Inscription description",
    })

    const items = setBreadcrumb([{
        title: 'Inscription'
    }])

    const {handleSubmit, watch, control, formState: {errors}, trigger} = useForm<z.infer<typeof inscriptionSchema>>({
        resolver: zodResolver(inscriptionSchema),
    })

    const onSubmit = (data: z.infer<typeof inscriptionSchema>) => {
        console.log(data)
    }

    const [validationTriggered, setValidationTriggered] = useState(false)

    const [current, setCurrent] = useState(0)

    const next = async () => {
        setCurrent(() => current + 1)
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
            setCurrent(() => current + 1)
        }
    }

    const prev = () => setCurrent(() => current - 1)

    const steps = [
        {
            title: 'Individuelle',
            content: <IndividualForm control={control} errors={errors} validationTriggered={validationTriggered} />
        },
        {
            title: 'Adresse',
            content: <AddressForm />
        },
        {
            title: 'Académique',
            content: <AcademicForm />
        },
        {
            title: 'Tuteur',
            content: <GuardianForm />
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

    const formData = watch()

    useEffect(() => {
        console.log(formData)
    }, [formData]);

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
                            {current < steps.length - 1 && (
                                <Button type='primary' onClick={next}>Suivant</Button>
                            )}
                            {current === steps.length - 1 && (
                                <Button type='primary' htmlType='submit'>Terminer</Button>
                            )}
                            {current > 0 && (
                                <Button onClick={prev}>précédent</Button>
                            )}
                        </Flex>
                    </Form>
                </div>
            </Flex>
        </>

    )
}

export default Inscription