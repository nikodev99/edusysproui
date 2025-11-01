import {Alert} from "antd";
import {ReactNode, useMemo} from "react";

interface ValidationAlertProps {
    alertMessage: ReactNode,
    message?: string[] | string | unknown[] | unknown | ReactNode,
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
        if (typeof message === 'object') {
            return messageErrors(Object.values(message as Record<string, string>))
        }
        if (typeof message === 'string') {
            return message
        }
        return <span>{message as string}</span>
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