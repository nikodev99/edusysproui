import {Alert} from "antd";
import {ReactNode} from "react";

export const ValidationAlert = ({alertMessage, message}: {alertMessage: ReactNode, message?: string[] | string}) => {

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

    return (
        <Alert
            style={{marginBottom: '15px'}}
            message={alertMessage}
            type='error'
            description={messageErrors(message as string[])}
            closable
            showIcon
        />
    )
}