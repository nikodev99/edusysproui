import {Avatar as AntAvatar} from "antd";
import {chooseColor} from "../../../utils/utils.ts";

interface AvatarProps {
    image?: string
    firstText?: string
    lastText?: string
    size?: number | object
}

const Avatar = ({image, firstText, lastText, size}: AvatarProps) => {
    return(
        <>
        {
            image ? <AntAvatar src={image} size={size} />
                : <AntAvatar style={{background: chooseColor(lastText as string) as string}} size={size}>
                    {`${lastText?.charAt(0)}${firstText?.charAt(0)}`}
                </AntAvatar>
        }
        </>
    )
}

export default Avatar