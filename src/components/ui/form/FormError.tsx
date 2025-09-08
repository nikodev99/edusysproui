import {message as errorMessage, notification} from 'antd'
import {ReactNode, useEffect} from "react";
import Datetime from "../../../core/datetime.ts";

const FormError = (
    {message, isNotif, onClose}: {
        message?: string[] | string | ReactNode,
        isNotif?: boolean,
        onClose?: () => void
}) => {
    const [messageApi, contextHolder] = errorMessage.useMessage();
    const [api, notifContext] = notification.useNotification();
    
    const key = `updatable-${Datetime.now()}`;

    useEffect(() => {
        if (isNotif) {
            api.open({
                key,
                message: Array.isArray(message) ? message[0] : message,
                type: 'error',
                placement: 'topRight',
                duration: 4,
                description: Array.isArray(message) ? message.slice(1).join('\n') : undefined,
                onClose: onClose
            })
        }else {
            if (Array.isArray(message)) {
                message.forEach((msg, index) => {
                    setTimeout(() => {
                        messageApi.error(msg, 1).then()
                    }, index * 1000)
                })
            } else {
                messageApi.open({
                    key,
                    type: 'loading',
                    content: 'chargement...'
                }).then()
                setTimeout(() => {
                    messageApi.open({
                        key,
                        type: 'error',
                        content: message,
                        duration: 10,
                    }).then()
                }, 2000)
            }
        }
    }, [api, isNotif, key, message, messageApi]);

    return(
        <>
            {isNotif ? notifContext : contextHolder}
        </>
    )
}

export  default FormError