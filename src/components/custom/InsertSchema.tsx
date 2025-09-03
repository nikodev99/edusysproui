import React, {ReactNode, useState} from "react";
import {FieldValues} from "react-hook-form";
import {useQueryPost} from "../../hooks/usePost.ts";
import {useGlobalStore} from "../../core/global/store.ts";
import {catchError} from "../../data/action/error_catch.ts";
import {Alert, Button, Flex, Form, Modal, ModalProps} from "antd";
import {PopConfirm} from "../ui/layout/PopConfirm.tsx";
import {PostSchemaProps, SchemaProps} from "../../core/utils/interfaces.ts";
import Marquee from "react-fast-marquee";

type InsertSchemaType<TData extends FieldValues> = SchemaProps<TData>
    & ModalProps
    & PostSchemaProps<TData>
    & {
        onSuccess?: (response: unknown) => void,
        onError?: (error: string) => void
    }

const InsertModal = <TData extends FieldValues>(
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
        handleForm,
        explain,
        onSuccess,
        marquee = false,
        onError
    }: InsertSchemaType<TData>
) => {
    const breakpoints = useGlobalStore.use.modalBreakpoints();

    const handleModalClose = (e: React.MouseEvent<HTMLButtonElement>) => {
        onCancel?.(e);
    };

    const handleFormCancel = () => {
        // Create a synthetic event for backward compatibility
        const syntheticEvent = {
            preventDefault: () => {},
            stopPropagation: () => {},
        } as React.MouseEvent<HTMLButtonElement>;

        handleModalClose(syntheticEvent);
    };

    const handleFormSuccess = (response: unknown) => {
        onSuccess?.(response);
        // Optionally close modal on success
        // handleFormCancel();
    };

    return (
        <Modal
            title={title}
            open={open}
            onCancel={handleModalClose}
            width={breakpoints}
            footer={null}
            destroyOnClose
        >
            <InsertSchema
                data={data}
                postFunc={postFunc}
                messageSuccess={messageSuccess}
                cancelText={cancelText}
                okText={okText}
                description={description}
                customForm={customForm}
                handleForm={handleForm}
                explain={explain}
                onClose={handleFormCancel}
                onSuccess={handleFormSuccess}
                onError={onError}
                marquee={marquee}
            />
        </Modal>
    );
}

const InsertSchema = <TData extends FieldValues>(
    {
        data,
        onClose,
        postFunc,
        messageSuccess,
        cancelText = 'Annuler',
        okText = 'Confirmer',
        description,
        customForm,
        handleForm,
        explain,
        onSuccess,
        onError,
        marquee = false
    }: InsertSchemaType<TData> & {
        onSuccess?: (response: unknown) => void,
        onError?: (error: string) => void
        onClose?: () => void,
    }
) => {
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<ReactNode | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    const { mutate, isPending } = useQueryPost<TData>(data);

    const clearMessages = () => {
        setErrorMessage(undefined);
        setSuccessMessage(undefined);
    };

    const onSubmit = (formData: TData) => {
        clearMessages();

        mutate(
            { postFn: postFunc, data: formData },
            {
                onSuccess: (response) => {
                    if (response.status === 200) {
                        setSuccessMessage(messageSuccess);
                        handleForm.reset();
                        onSuccess?.(response);
                    }
                },
                onError: (error) => {
                    const errorMsg = catchError(error) as string;
                    setErrorMessage(errorMsg);
                    onError?.(errorMsg);
                },
            }
        );
        setOpenConfirm(false);
    };

    const handleCancel = () => {
        clearMessages();
        onClose?.();
    };

    const handleConfirmOpen = () => {
        setOpenConfirm(true);
    };

    const handleConfirmCancel = () => {
        setOpenConfirm(false);
    };

    return (
        <>
            {successMessage && (<Alert message={successMessage} type="success" showIcon closable onClose={clearMessages}/>)}
            {errorMessage && (<Alert message={errorMessage} type="error" showIcon closable onClose={clearMessages}/>)}
            {explain && (<Alert style={{ marginTop: '10px' }} message={marquee ? (
                <Marquee pauseOnHover gradient={false}>
                    <span style={{ display: "inline-block", paddingRight: "3rem" }}>
                        {explain}
                    </span>
                </Marquee>
            ) : explain} type="info" showIcon/>)}

            <Form layout="vertical" style={{ marginTop: '15px' }}>
                {customForm}

                <Flex justify="flex-start" gap="small" style={{ marginTop: '20px' }}>
                    {onClose && <Button onClick={handleCancel} disabled={isPending}>
                        {cancelText}
                    </Button>}

                    <PopConfirm
                        title="Confirmation"
                        open={openConfirm}
                        onCancel={handleConfirmCancel}
                        description={description}
                        okText="Confirmer"
                        onConfirm={handleForm.handleSubmit(onSubmit)}
                    >
                        <Button
                            disabled={isPending}
                            type="primary"
                            onClick={handleConfirmOpen}
                        >
                            {okText}
                        </Button>
                    </PopConfirm>
                </Flex>
            </Form>
        </>
    );
}

export { InsertModal, InsertSchema }
