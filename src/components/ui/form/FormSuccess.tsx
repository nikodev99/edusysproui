import {message as successMassage, notification} from 'antd'
import {ReactNode, useEffect} from "react";

const FormSuccess = ({message, setRedirect, isNotif, type = 'success', onClose, setActivity}: {
    message?: string | ReactNode,
    setRedirect?: (url?: string) => void,
    isNotif?: boolean,
    type?: 'success' | 'error' | 'info' | 'warning'
    onClose?: () => void
    setActivity?: () => Promise<boolean>
}) => {
    const [messageApi, messageContext] = successMassage.useMessage()
    const [api, notifContext] = notification.useNotification()
    const key = 'updatable'

    useEffect( () => {
        if (isNotif) {
            const handleNotificationClose = () => {
                if (onClose) {
                    onClose();
                }

                if (setActivity) {
                    setActivity().then(bool => {
                        if (bool) {
                            setRedirect?.();
                        }
                    });
                } else {
                    setRedirect?.();
                }
            }

            api.open({
                key,
                message: message,
                type: type,
                placement: 'topRight',
                duration: 2,
                onClose: handleNotificationClose
            })
        }else {
            messageApi.open({
                key,
                type: 'loading',
                content: 'chargement...'
            }).then()

            setTimeout(() => {
                console.log('2 seconds passed, showing success message');
                messageApi.open({
                    key,
                    type: 'success',
                    content: message,
                    duration: 2,
                }).then()

                setTimeout(() => {
                    if (setActivity) {
                        setActivity().then(bool => {
                            if (bool) {
                                setRedirect?.()
                            } else {
                                console.log('setActivity returned false, not redirecting');
                            }
                        })
                    } else {
                        setRedirect?.()
                    }
                }, 2500)
            }, 2000)
        }

    }, [api, isNotif, message, messageApi, onClose, setActivity, setRedirect, type])

    return(
        <>
            {isNotif ? notifContext : messageContext}
        </>
    )
}

export default FormSuccess