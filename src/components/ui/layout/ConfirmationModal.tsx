import FormSuccess from "../../ui/form/FormSuccess.tsx";
import {text} from "../../../core/utils/text_display.ts";
import FormError from "../../ui/form/FormError.tsx";
import {Alert, Button, Flex, Modal} from "antd";
import {ConfirmButtonProps, ModalConfirmButton} from "./ModalConfirmButton.tsx";
import {CSSProperties, ReactNode, useCallback, useMemo} from "react";

export type Messages = {
    success?: ReactNode,
    error?: ReactNode,
}

type AlertType = 'success' | 'info' | 'warning' | 'error'

interface AlertDesc {
    alert?: boolean;
    type?: AlertType;
    msg: ReactNode;
}

export interface ConfirmationProps<T extends object> {
    data: T,
    open: boolean,
    close: () => void
    setRefetch?: (refetch: boolean) => void,
    modalTitle?: ReactNode | ((data: T) => ReactNode),
    alertDesc?: AlertDesc
    customComponent?: ReactNode
    justify?: CSSProperties['justifyContent'];
    hasCancelBtn?: boolean
    messages?: Messages
}

const DEFAULT_ALERT: Required<AlertDesc> = {
    alert: true,
    type: "info",   // valeur valide de l'union
    msg: ""
};

export type ConfirmationTYpe<TData extends object> = ConfirmationProps<TData> & ConfirmButtonProps<TData>

export const ConfirmationModal = <TData extends object>(
    {
        data, open, close, setRefetch, handleFunc, modalTitle, alertDesc, customComponent, justify = 'flex-end',
        hasCancelBtn = false, title = 'Souhaitez vous poursuivre ?', content = 'Veuillez cliquer sur OUI pour confirmer', tooltipTxt,
        btnTxt, btnProps, okTxt, cancelTxt, messages
    }: ConfirmationTYpe<TData>
) => {

    const successMessage = useMemo(() => messages?.success, [messages?.success])
    const errorMessage = useMemo(() => messages?.error, [messages?.error])

    const alerting = useMemo(() => {
        return { ...DEFAULT_ALERT, ...(alertDesc ?? {}) }
    }, [alertDesc]);

    const descMessage = useMemo(() => alerting?.msg, [alerting?.msg])
    
    const setTitle = useMemo(() => {
        if (typeof modalTitle === 'function') {
            return modalTitle(data)
        }
        return modalTitle
    }, [data, modalTitle])

    const component = useMemo(() => customComponent ?? undefined, [customComponent])

    const handleSubmitFunc = useCallback((data?: TData) => {
        handleFunc(data)
    }, [handleFunc])

    const handleCancel = () => {
        setRefetch?.(true)
        close()
    }

    return(
        <>
            {successMessage && <FormSuccess message={successMessage} redirectLink={text.org.group.user.href} />}
            {errorMessage && <FormError message={errorMessage} isNotif />}
            <Modal
                open={open}
                onCancel={handleCancel}
                destroyOnClose
                title={setTitle}
                footer={null}
            >
                {successMessage && <Alert type={'success'} message={successMessage} closeIcon showIcon style={{marginBottom: '10px'}} />}
                {errorMessage && <Alert type={'error'} message={errorMessage} closeIcon showIcon style={{marginBottom: '10px'}} />}
                {alerting?.alert ? <Alert style={{marginBottom: '15px'}} type={alerting.type} message={descMessage} showIcon /> : alerting?.msg}
                {component}
                <Flex style={{marginTop: '20px'}} justify={justify} gap={10}>
                    <ModalConfirmButton
                        handleFunc={handleSubmitFunc}
                        title={title}
                        content={content}
                        tooltipTxt={tooltipTxt}
                        btnTxt={btnTxt}
                        btnProps={btnProps}
                        okTxt={okTxt}
                        cancelTxt={cancelTxt}
                    />
                </Flex>
                {hasCancelBtn && <Flex justify={'flex-end'} gap={10} style={{marginTop: '20px'}}>
                    <Button onClick={close}>Annuler</Button>
                </Flex>}
            </Modal>
        </>
    )
}