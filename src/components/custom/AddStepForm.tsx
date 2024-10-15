import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {Breadcrumb, setBreadcrumb} from "../../core/breadcrumb.tsx";
import {Button, Flex, Form, Modal, Steps} from "antd";
import {FieldValues, UseFormReturn} from "react-hook-form";
import {ReactNode, useState} from "react";
import {useLocation} from "react-router-dom";
import queryString from 'query-string'
import {Metadata} from "../../utils/interfaces.ts";
import FormError from "../../components/ui/form/FormError.tsx";
import FormSuccess from "../../components/ui/form/FormSuccess.tsx";
import PageWrapper from "../../components/ui/layout/PageWrapper.tsx";
import {redirectTo} from "../../context/RedirectContext.ts";
import {requiredMark} from "../../utils/tsxUtils.tsx";

interface AddStepsProps<TFieldValues extends FieldValues> {
    docTitle: Metadata,
    breadCrumb: Breadcrumb[]
    addLink: string
    HandleForm: UseFormReturn<TFieldValues>
    triggerNext: (current: number) => void
    onSubmit: (data: TFieldValues) => void
    steps: {title: ReactNode, content: ReactNode}[]
    messages: {success?: string, error?: string}
    isPending: boolean
    stepsDots?: boolean | ((iconDot: ReactNode, {index, status, title, description}: never) => ReactNode)
}

const AddStepForm = <TFieldValues extends FieldValues>(
    {
        docTitle,
        breadCrumb,
        addLink,
        HandleForm,
        triggerNext,
        onSubmit,
        steps,
        messages,
        isPending,
        stepsDots
    }: AddStepsProps<TFieldValues>
) => {

    useDocumentTitle(docTitle)
    const items = setBreadcrumb(breadCrumb);

    const [btnLoading, setBtnLoading] = useState<boolean[]>([])

    const location = useLocation()
    const queryParam = queryString.parse(location.search)
    const stepNumber = Number(queryParam.step) || 0
    const current = stepNumber > 5 ? 0 : stepNumber
    const {error, success} = messages

    const next = async () => triggerNext(current)

    const prev = () => redirectTo(`${addLink}?step=${current - 1}`)

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
                onOk: () => HandleForm.handleSubmit(onSubmit)()
            })
        }, 2000)
    }

    const stepItems = steps.map((item) => ({key: item.title, title: item.title}))

    return(
        <>
            <PageHierarchy items={items as [{title: string|ReactNode, path?: string}]}/>
            <PageWrapper>
                {error && (<FormError message={error}/>)}
                {success && (<FormSuccess message={success} toRedirect={true}/>)}
                <Flex className='inscription-wrapper' vertical>
                    <div className='form-wrapper'>
                        <Form layout="vertical" initialValues={{requiredMarkValue: 'customize'}}
                              requiredMark={requiredMark} onFinish={HandleForm.handleSubmit(onSubmit)}>
                            <div className="step-wrapper">
                                <Steps current={current} progressDot={stepsDots as never} items={stepItems}/>
                            </div>
                            <div className='step-content'>
                                {steps[current].content}
                            </div>
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

export {AddStepForm }
