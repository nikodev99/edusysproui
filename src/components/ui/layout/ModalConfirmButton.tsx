import {Button, ButtonProps, Modal, Tooltip} from "antd";
import {ReactNode} from "react";

export interface ConfirmButtonProps<TDataType> {
    btnProps?: ButtonProps
    handleFunc: (dataType?: TDataType) => void
    funcParam?: TDataType
    title?: ReactNode
    content?: ReactNode
    okTxt?: ReactNode
    cancelTxt?: ReactNode
    btnTxt?: ReactNode
    onOk?: ((...args: unknown[]) => unknown) | undefined
    onCancel?: ((...args: unknown[]) => unknown) | undefined,
    tooltipTxt?: ReactNode
}

export const ModalConfirmButton = <TDataType extends object | string | number | bigint>(
    {handleFunc, funcParam, btnProps, title, content, okTxt = 'Oui', cancelTxt = 'Non', onOk, onCancel, btnTxt, tooltipTxt}: ConfirmButtonProps<TDataType>
) => {

    const showPromiseConfirm = () => {
        Modal.confirm({
            title: title ?? 'Voulez-vous vraiment confirmer',
            content: content ?? 'Veuillez cliquer sur OUI, pour confirmer',
            okText: okTxt,
            cancelText: cancelTxt,
            onOk: onOk ? onOk : async () => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        try {
                            handleFunc(funcParam);
                            resolve('Success');
                        } catch (error) {
                            reject(error);
                        }
                    }, 2000);
                });
            },
            onCancel: onCancel ? onCancel : (() => {}),
        })
    }

    return(
        <>
            {tooltipTxt ? (
                <Tooltip title={tooltipTxt}>
                    <Button {...btnProps} onClick={showPromiseConfirm}>{btnTxt}</Button>
                </Tooltip>
            ) : (
                <Button {...btnProps} onClick={showPromiseConfirm}>{btnTxt}</Button>
            )}
        </>
    )
}