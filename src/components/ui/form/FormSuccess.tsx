import {message as successMassage} from 'antd'
import {useEffect} from "react";
import {useNavigation} from "../../../hooks/useNavigation.ts";

const FormSuccess = ({message}: {message?: string}) => {
    const [messageApi, contextHolder] = successMassage.useMessage()
    const navigate = useNavigation('/student/all')
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
                navigate()
            })
        }, 1000)
    }, [message, messageApi, navigate])

    return(
        <>
            {contextHolder}
        </>
    )
}

export default FormSuccess