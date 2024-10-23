import {message as errorMessage} from 'antd'
import {useEffect} from "react";

const FormError = ({message}: {message?: string[] | string}) => {
    const [messageApi, contextHolder] = errorMessage.useMessage()
    const key = 'updatable'

    useEffect(() => {
        if (Array.isArray(message)) {
            message.forEach((msg, index) => {
                setTimeout(() => {
                    messageApi.error(msg, 1).then()
                }, index * 1000)
            })
        }else {
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
                    duration: 2,
                }).then()
            }, 2000)
        }
    }, [message, messageApi]);

    return(
        <>
            {contextHolder}
        </>
    )
}

export  default FormError