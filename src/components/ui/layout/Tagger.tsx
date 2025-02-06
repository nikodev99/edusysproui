import Tag from "./Tag.tsx";
import {LuCheckCheck, LuTriangleAlert} from "react-icons/lu";

const tagger = ({status, successMessage, warnMessage}: {status: boolean, successMessage: string, warnMessage: string}) => {
    return(
            status ? (
                <Tag color='success' icon={<LuCheckCheck />}>{successMessage}</Tag>
            ) : (
                <Tag color='warning' icon={<LuTriangleAlert  />}>{warnMessage}</Tag>
            )
    )
}

export default tagger