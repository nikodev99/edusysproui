import {Button, ButtonProps, Modal, Tooltip} from "antd";
import {ReactNode} from "react";

interface ConfirmButtonProps<TDataType> {
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
    {handleFunc, funcParam, btnProps, title, content, okTxt, cancelTxt, onOk, onCancel, btnTxt, tooltipTxt}: ConfirmButtonProps<TDataType>
) => {

    const showPromiseConfirm = () => {
        Modal.confirm({
            title: title ?? 'Voulez-vous vraiment supprimer',
            content: content ?? 'Soyez assurer lorsque vous cliquerez sur OUI, cet evaluation sera définitivement supprimer',
            okText: okTxt ?? 'Oui',
            cancelText: cancelTxt ?? 'Non',
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
        <Tooltip title={tooltipTxt ?? 'Supprimer'}>
            <Button {...btnProps} onClick={showPromiseConfirm}>{btnTxt}</Button>
        </Tooltip>
    )
}