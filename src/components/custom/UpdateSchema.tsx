import {ID, PutSchemaProps, SchemaProps} from "../../utils/interfaces.ts";
import {FieldValues} from "react-hook-form";
import {Alert, Button, Flex, Form, Modal, ModalProps} from "antd";
import {PopConfirm} from "../ui/layout/PopConfirm.tsx";
import {useQueryUpdate} from "../../hooks/useUpdate.ts";
import {useToggle} from "../../hooks/useToggle.ts";
import React, {useState} from "react";
import {useGlobalStore} from "../../core/global/store.ts";
import {catchError} from "../../data/action/error_catch.ts";

type UpdateSchemaProps<TData extends FieldValues> = SchemaProps<TData> & {
    id: ID,
    resp?: (resp: Record<string, boolean>) => void,
    confirmBtnText?: string
} & ModalProps & PutSchemaProps<TData>

export const UpdateSchema = <TData extends FieldValues>(
    {data, messageSuccess, handleForm, customForm, id, resp, open, title, description, cancelText, onCancel, putFunc, okText, confirmBtnText}: UpdateSchemaProps<TData>
) => {

    const [openConfirm, setOpenConfirm] = useToggle(false);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const breakpoints = useGlobalStore.use.modalBreakpoints()

    const {mutate, isPending} = useQueryUpdate(data)

    const onSubmit = (data: TData) => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        mutate({putFn: putFunc, data: data, id: id}, {
            onSuccess: response => {
                if (response && response.status === 200) {
                    setSuccessMessage(messageSuccess ?? response?.data?.updated)
                    if (resp) {
                        resp(response?.data as Record<string, boolean>)
                    }
                }
            },
            onError: (error) => setErrorMessage(catchError(error))
        })
        setOpenConfirm()
    }

    const handleModalClose = (e: React.MouseEvent<HTMLButtonElement>) => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        if (onCancel) {
            onCancel(e)
        }
    }

    return(
        <Modal title={title} open={open} onCancel={handleModalClose} width={breakpoints} footer={null}>
            {successMessage && (<Alert message={successMessage} type="success" showIcon/>)}
            {errorMessage && (<Alert message={errorMessage} type="error" showIcon/>)}
            <Form layout='vertical' style={{marginTop: '15px'}}>
                {customForm}
                <Flex justify='flex-end' gap='small'>
                    <Button onClick={handleModalClose}>{cancelText ?? 'Annuler'}</Button>
                    <PopConfirm
                        title='Confirmation'
                        open={openConfirm}
                        onCancel={setOpenConfirm}
                        description={description}
                        okText={confirmBtnText ?? "Confirmer"}
                        onConfirm={handleForm.handleSubmit(onSubmit)}
                    >
                        <Button disabled={isPending} type='primary' onClick={setOpenConfirm}>{okText}</Button>
                    </PopConfirm>
                </Flex>
            </Form>
        </Modal>
    )

}