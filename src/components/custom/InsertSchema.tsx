import React, {ReactNode, useState} from "react";
import {FieldValues, UseFormReturn} from "react-hook-form";
import {useQueryPost} from "../../hooks/usePost.ts";
import {useGlobalStore} from "../../core/global/store.ts";
import {catchError} from "../../data/action/error_catch.ts";
import {Alert, Button, Flex, Form, Modal, ModalProps} from "antd";
import {PopConfirm} from "../ui/layout/PopConfirm.tsx";
import {z} from "zod";
import {AxiosResponse} from "axios";

interface InsertSchemaProps<TData extends FieldValues> {
    data: z.ZodSchema<TData>;
    messageSuccess?: string;
    description?: string;
    customForm: ReactNode
    handleForm: UseFormReturn<TData>
    postFunc: (data: TData) => Promise<AxiosResponse<TData>>
}

type InsertSchemaType<TData extends FieldValues> = InsertSchemaProps<TData> & ModalProps

const InsertSchema = <TData extends FieldValues>(
    {
        data,
        open,
        onCancel,
        postFunc,
        messageSuccess,
        title,
        cancelText,
        okText,
        description,
        customForm,
        handleForm
    }: InsertSchemaType<TData>
) => {
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const {mutate, isPending} = useQueryPost<TData>(data)
    const breakpoints = useGlobalStore.use.modalBreakpoints()

    const onSubmit = (data: TData) => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        console.log('Data to insert: ', data)
        mutate({postFn: postFunc, data: data}, {
            onSuccess: response => {
                if (response.status === 200) {
                    setSuccessMessage(messageSuccess)
                    handleForm.reset()
                }
            },
            onError: error => setErrorMessage(catchError(error))
        })
        setOpenConfirm(false)
    }

    const handleModalClose = (e: React.MouseEvent<HTMLButtonElement>) => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        if (onCancel) {
            onCancel(e)
        }
    }

    return (
        <Modal
            title={title}
            open={open}
            onCancel={handleModalClose}
            width={breakpoints}
            footer={null}
        >
            {successMessage && (<Alert message={successMessage} type="success" showIcon/>)}
            {errorMessage && (<Alert message={errorMessage} type="error" showIcon/>)}
            <Form layout='vertical' style={{marginTop: '15px'}}>
                {customForm}
                <Flex justify='flex-end' gap='small'>
                    <Button onClick={handleModalClose}>{cancelText ?? 'Annuler'}</Button>
                    <PopConfirm
                        title='Confirmation'
                        open={openConfirm}
                        onCancel={() => setOpenConfirm(false)}
                        description={description}
                        okText="Confirmer"
                        onConfirm={handleForm.handleSubmit(onSubmit)}
                    >
                        <Button disabled={isPending} type='primary'
                                onClick={() => setOpenConfirm(true)}>{okText}</Button>
                    </PopConfirm>
                </Flex>
            </Form>
        </Modal>
    )
}

export { InsertSchema }
