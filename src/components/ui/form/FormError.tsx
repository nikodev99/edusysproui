import {message as errorMessage} from 'antd'
import {useEffect} from "react";

const FormError = ({message}: {message?: string}) => {
    const [messageApi, contextHolder] = errorMessage.useMessage()
    const key = 'updatable'

    useEffect(() => {
        if (message) {
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
                    duration: 5000,
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