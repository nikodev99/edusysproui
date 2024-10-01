import {Tag} from "antd";

const tagger = ({status, successMessage, warnMessage}: {status: boolean, successMessage: string, warnMessage: string}) => {
    return(
            status ? (<Tag color='success'>{successMessage}</Tag>) : (<Tag color='warning'>{warnMessage}</Tag>)
    )
}

export default tagger