import FormSuccess from "@/components/ui/form/FormSuccess.tsx";
import FormError from "@/components/ui/form/FormError.tsx";
import {Alert} from "antd";
import {ReactNode} from "react";

export type NotificationProps = {
    responseMessages?: {success?: ReactNode, error?: ReactNode}
    setRedirect?: (url?: string) => void
    isNotif?: boolean
}

export const Notification = ({responseMessages, setRedirect, isNotif = true}: NotificationProps) => {
    return(
        <>
            {responseMessages?.success && <FormSuccess message={responseMessages?.success} setRedirect={setRedirect} isNotif={isNotif}/>}
            {responseMessages?.error && <FormError message={responseMessages?.error} isNotif={isNotif}/>}

            {responseMessages?.success && <Alert type={'success'} message={responseMessages?.success} closeIcon showIcon style={{marginBottom: '10px'}}/>}
            {responseMessages?.error && <Alert type={'error'} message={responseMessages?.error} closeIcon showIcon style={{marginBottom: '10px'}}/>}
        </>
    )
}