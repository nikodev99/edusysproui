import FormSuccess from "@/components/ui/form/FormSuccess.tsx";
import FormError from "@/components/ui/form/FormError.tsx";
import {Alert} from "antd";
import {ReactNode} from "react";

export type NotificationProps = {
    responseMessages?: {success?: ReactNode, error?: ReactNode}
    setRedirect?: (url?: string) => void
    isNotif?: boolean
    onClose?: () => void
    onlyNotif?: boolean
}

export const Notification = ({responseMessages, setRedirect, isNotif = true, onClose, onlyNotif = false}: NotificationProps) => {
    return(
        <>
            {responseMessages?.success && <FormSuccess message={responseMessages?.success} setRedirect={setRedirect} isNotif={isNotif || onlyNotif}/>}
            {responseMessages?.error && <FormError message={responseMessages?.error} isNotif={isNotif || onlyNotif}/>}

            {!onlyNotif &&  responseMessages?.success && <Alert type={'success'} message={responseMessages?.success} closeIcon showIcon  onClose={onClose} style={{marginBottom: '10px'}}/>}
            {!onlyNotif && responseMessages?.error && <Alert type={'error'} message={responseMessages?.error} closeIcon showIcon onClose={onClose} style={{marginBottom: '10px'}}/>}
        </>
    )
}