import {Alert} from "antd";
import {ReactNode, useMemo} from "react";

interface ValidationAlertProps {
    alertMessage: ReactNode,
    message?: string[] | string | ReactNode,
    type?: "success" | "info" | "warning" | "error"
}

export const ValidationAlert = ({alertMessage, message, type = 'error'}: ValidationAlertProps) => {

    const messageErrors = (entries: string[]): ReactNode => {
        if (entries) {
            return <ul>
                {entries.map((entry, index) => (
                    <li key={index}>{entry}</li>
                ))}
            </ul>
        }
        return null
    }

    const description = useMemo(() => {
        if (Array.isArray(message)) {
            return messageErrors(message)
        }
        return message
    }, [message])

    return (
        <Alert
            style={{marginBottom: '15px'}}
            message={alertMessage}
            type={type}
            description={description}
            closable
            showIcon
        />
    )
}