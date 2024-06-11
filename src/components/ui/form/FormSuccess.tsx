import {message as successMassage} from 'antd'
import {useEffect} from "react";

const FormSuccess = ({message}: {message?: string}) => {
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
            })
        }, 1000)
    }, [message, messageApi])

    return(
        <>
            {contextHolder}
        </>
    )
}

export default FormSuccess