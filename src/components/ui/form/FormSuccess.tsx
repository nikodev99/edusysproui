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
            })
            navigate()
        }, 4000)
    }, [message, messageApi])

    return(
        <>
            {contextHolder}
        </>
    )
}

export default FormSuccess