import {Avatar as AntAvatar} from "antd";
import {chooseColor} from "../../../utils/utils.ts";
import {useEffect} from "react";

interface AvatarProps {
    image?: string
    firstText?: string
    lastText?: string
    size?: number | object
    setColor?: (color: string) => void,
    onClick?: () => void
}

const Avatar = ({image, firstText, lastText, size, setColor, onClick}: AvatarProps) => {
    
    const color: string = chooseColor(firstText as string) as string

    useEffect(() => {
        if (setColor) {
            setColor(color)
        }
    }, [color, setColor]);
    
    return(
        <>
        {
            image ? <AntAvatar src={image} size={size} onClick={onClick} />
                : <AntAvatar style={{background: color}} size={size} onClick={onClick}>
                    {`${lastText?.charAt(0)}${firstText?.charAt(0)}`}
                </AntAvatar>
        }
        </>
    )
}

export default Avatar