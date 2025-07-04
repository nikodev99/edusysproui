import {ID, PutSchemaProps, SchemaProps} from "../../core/utils/interfaces.ts";
import {FieldValues} from "react-hook-form";
import {Alert, Button, Flex, Form, Modal, ModalProps} from "antd";
import {PopConfirm} from "../ui/layout/PopConfirm.tsx";
import {useQueryUpdate} from "../../hooks/useUpdate.ts";
import {useToggle} from "../../hooks/useToggle.ts";
import React, {useState} from "react";
import {useGlobalStore} from "../../core/global/store.ts";
import {catchError} from "../../data/action/error_catch.ts";

type UpdateSchemaProps<TData extends FieldValues, TReturn> = SchemaProps<TData> & {
    id: ID,
    resp?: (resp: TReturn) => void,
    confirmBtnText?: string
} & ModalProps & PutSchemaProps<TData, TReturn>

export const UpdateSchema = <TData extends FieldValues, TReturn extends object>(
    {data, messageSuccess, handleForm, customForm, id, resp, open, title, description, cancelText, onCancel, putFunc, okText, confirmBtnText}: UpdateSchemaProps<TData, TReturn>
) => {

    const [openConfirm, setOpenConfirm] = useToggle(false);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const breakpoints = useGlobalStore.use.modalBreakpoints()

    const {mutate, isPending} = useQueryUpdate<TData>(data)

    const onSubmit = (data: TData) => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        mutate({putFn: putFunc, data: data, params: [], id: id}, {
            onSuccess: response => {
                if (response && 'data' in response && 'updated' in response.data && response.status === 200) {
                    setSuccessMessage(messageSuccess ?? response?.data?.updated as string)
                    if (resp) {
                        resp(response?.data as never)
                    }
                }
            },
            onError: (error) => setErrorMessage(catchError(error) as string)
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
        <Modal title={title ?? 'Modification'} open={open} onCancel={handleModalClose} width={breakpoints} footer={null}>
            {successMessage && (<Alert message={successMessage} type="success" showIcon style={{marginBottom: '10px'}}/>)}
            {errorMessage && (<Alert message={errorMessage} type="error" showIcon style={{marginBottom: '10px'}}/>)}
            <Form layout='vertical' style={{marginTop: '15px'}}>
                {customForm}
                <Flex justify='flex-end' gap='small'>
                    <Button onClick={handleModalClose}>{cancelText ?? 'Annuler'}</Button>
                    <PopConfirm
                        title='Confirmation'
                        open={openConfirm}
                        onCancel={setOpenConfirm}
                        description={description ?? 'Veuillez confirmer'}
                        okText={confirmBtnText ?? "Confirmer"}
                        onConfirm={handleForm.handleSubmit(onSubmit)}
                    >
                        <Button disabled={isPending} type='primary' onClick={setOpenConfirm}>{'Modifier' ?? okText}</Button>
                    </PopConfirm>
                </Flex>
            </Form>
        </Modal>
    )

}