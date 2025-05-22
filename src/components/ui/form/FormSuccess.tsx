import {message as successMassage, notification} from 'antd'
import {useEffect} from "react";
import {text} from "../../../core/utils/text_display.ts";
import {redirect} from "react-router-dom";

const FormSuccess = ({message, toRedirect, redirectLink, isNotif, type = 'success', onClose}: {
    message?: string,
    toRedirect?: boolean,
    redirectLink?: string,
    isNotif?: boolean,
    type?: 'success' | 'error' | 'info' | 'warning'
    onClose?: () => void
}) => {
    const [messageApi, messageContext] = successMassage.useMessage()
    const [api, notifContext] = notification.useNotification()
    const key = 'updatable'

    useEffect( () => {
        if (isNotif) {
            api.open({
                key,
                message: message,
                type: type,
                placement: 'topRight',
                duration: 2,
                onClose: onClose
            })
        }else {
            messageApi.open({
                key,
                type: 'loading',
                content: 'chargement...'
            })
            setTimeout(() => {
                messageApi.open({
                    key,
                    type: 'success',
                    content: message,
                    duration: 2,
                }).then(() => {
                    if (toRedirect){
                        redirect(redirectLink ? redirectLink : text.student.href)
                    }
                })
            }, 2000)
        }

    }, [api, isNotif, message, messageApi, redirectLink, toRedirect, type])

    return(
        <>
            {isNotif ? notifContext : messageContext}
        </>
    )
}

export default FormSuccess