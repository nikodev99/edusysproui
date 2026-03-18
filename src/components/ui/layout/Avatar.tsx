import {Avatar as AntAvatar} from "antd";
import {chooseColor} from "@/core/utils/utils.ts";
import {CSSProperties, useEffect} from "react";

interface AvatarProps {
    image?: string
    firstText?: string
    lastText?: string
    size?: number | object
    setColor?: (color: string) => void,
    onClick?: () => void
    style?: CSSProperties
}

export const Avatar = ({image, firstText, lastText, size, setColor, onClick, style}: AvatarProps) => {
    
    const color: string = chooseColor(firstText as string) as string

    useEffect(() => {
        if (setColor) {
            setColor(color)
        }
    }, [color, setColor]);
    
    return(
        <>
        {
            image ? <AntAvatar style={style} src={image} size={size} onClick={onClick} />
                : <AntAvatar
                    style={onClick ? {background: color, cursor: 'pointer', ...style} : {background: color, ...style}}
                    size={size}
                    onClick={onClick}
                >
                    {`${lastText ? lastText?.charAt(0)?.toUpperCase(): ''}${firstText ? firstText?.charAt(0)?.toUpperCase() : ''}`}
                </AntAvatar>
        }
        </>
    )
}