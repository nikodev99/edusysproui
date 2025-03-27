import {message as successMassage} from 'antd'
import {useEffect} from "react";
import {text} from "../../../core/utils/text_display.ts";
import {redirect} from "react-router-dom";

const FormSuccess = ({message, toRedirect, redirectLink}: {message?: string, toRedirect?: boolean, redirectLink?: string}) => {
    const [messageApi, contextHolder] = successMassage.useMessage()
    const key = 'updatable'

    useEffect( () => {
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
    }, [message, messageApi, redirectLink, toRedirect])

    return(
        <>
            {contextHolder}
        </>
    )
}

export default FormSuccess