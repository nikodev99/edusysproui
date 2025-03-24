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

export const Avatar = ({image, firstText, lastText, size, setColor, onClick}: AvatarProps) => {
    
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
                : <AntAvatar
                    style={onClick ? {background: color, cursor: 'pointer'} : {background: color}}
                    size={size}
                    onClick={onClick}
                >
                    {`${lastText ? lastText?.charAt(0): ''}${firstText ? firstText?.charAt(0) : ''}`}
                </AntAvatar>
        }
        </>
    )
}