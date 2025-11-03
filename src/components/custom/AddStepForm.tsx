import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {BreadcrumbType, useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {Button, Flex, Form, Steps} from "antd";
import {FieldValues, UseFormReturn} from "react-hook-form";
import {ReactNode, useMemo} from "react";
import {useLocation} from "react-router-dom";
import queryString from 'query-string'
import {Metadata} from "../../core/utils/interfaces.ts";
import FormError from "../../components/ui/form/FormError.tsx";
import FormSuccess from "../../components/ui/form/FormSuccess.tsx";
import PageWrapper from "../view/PageWrapper.tsx";
import {redirectTo} from "../../context/RedirectContext.ts";
import {RequiredMark} from "../../core/utils/tsxUtils.tsx";
import {ValidationAlert} from "../ui/form/ValidationAlert.tsx";
import {LoadingButton} from "../ui/layout/LoadingButton.tsx";

interface AddStepsProps<TFieldValues extends FieldValues> {
    docTitle: Metadata,
    breadCrumb: BreadcrumbType[]
    addLink: string
    handleForm: UseFormReturn<TFieldValues>
    triggerNext: (current: number) => void
    onSubmit: (data: TFieldValues) => void
    steps: {title: ReactNode, content: ReactNode}[]
    messages: {success?: string, error?: string}
    isPending: boolean
    currentNumber: number
    stepsDots?: boolean | ((iconDot: ReactNode, {index, status, title, description}: never) => ReactNode)
    errors?: string[]
    setRedirect?: (url?: string) => void
    setActivity?: () => Promise<boolean>
}

const AddStepForm = <TFieldValues extends FieldValues>(
    {
        docTitle, breadCrumb, addLink, handleForm, triggerNext, onSubmit, steps, messages, isPending, stepsDots, currentNumber, errors,
        setRedirect, setActivity
    }: AddStepsProps<TFieldValues>
) => {

    useDocumentTitle(docTitle)
    const {context} = useBreadCrumb({bCItems: breadCrumb});

    const location = useLocation()
    const queryParam = queryString.parse(location.search)
    const stepNumber = Number(queryParam.step) || 0
    const current = stepNumber > currentNumber ? 0 : stepNumber
    const {error, success} = messages
    const {handleSubmit} = handleForm

    const hasErrors = useMemo(() => errors && errors?.length > 0, [errors])

    const next = async () => {
        triggerNext(current)
    }

    const prev = () => redirectTo(`${addLink}?step=${current - 1}`)

    const stepItems = steps.map((item) => ({key: item.title, title: item.title}))

    return(
        <>
            {context}

            <div className="step-wrapper">
                <Steps current={current} progressDot={stepsDots as never} items={stepItems} size='small' />
            </div>

            <PageWrapper>
                {hasErrors && <ValidationAlert
                    alertMessage='Une ou plusieurs erreurs de validation détectés'
                    message={errors}
                />}
                {error && (<FormError message={error} />)}
                {success && (<FormSuccess message={success} setRedirect={setRedirect} setActivity={setActivity} />)}
                <Flex className='inscription-wrapper' vertical>
                    <div className='form-wrapper'>
                        <Form layout="vertical" initialValues={{requiredMarkValue: 'customize'}}
                              requiredMark={RequiredMark} onFinish={handleForm.handleSubmit(onSubmit)}>
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
                                    <LoadingButton
                                        buttonText='Terminer'
                                        onConfirm={() => handleSubmit(onSubmit)()}
                                        isDisabled={isPending}
                                        modalContent="Souhaitez vous vraiment poursuivre avec l'inscription ?"
                                    />
                                )}
                            </Flex>
                        </Form>
                    </div>
                </Flex>
            </PageWrapper>
        </>

    )
}

export {AddStepForm}
