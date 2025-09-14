import {ReactNode, useMemo} from "react";
import '../ui.scss'
import {LuBadgeAlert, LuBadgeCheck, LuBadgeHelp, LuBadgeInfo} from "react-icons/lu";
import {Color} from "../../../core/utils/interfaces.ts";

interface TagProps {
    children?: ReactNode;
    color?: 'success' | 'warning' | 'danger' | 'processing' | Color;
    icon?: ReactNode;
    textColor?: Color;
    white?: boolean;
}

const Tag = ({color, children, icon, textColor, white}: TagProps) => {
    const isOtherColor = useMemo(() => 
        color && color !== 'success' && color !== 'danger' && color !== 'warning' && color !== 'processing', [color])
    
    const customIcon = useMemo(() => {
        if (isOtherColor)
            return undefined

        switch(color) {
            case 'success':
                return <LuBadgeCheck />
            case 'danger':
                return <LuBadgeAlert />
            case 'warning':
                return <LuBadgeHelp />
            default:
                return <LuBadgeInfo />
        }
    }, [color, isOtherColor])

    return (
        <div
            className={`tag__wrapper ${isOtherColor ? '' : color}`}
            style={isOtherColor ? {backgroundColor: color} : undefined}
        >
            <div className='tagged' style={textColor || white ? {color: textColor ?? '#dddde1'} : undefined}>
                {icon ? icon : customIcon}
                {children}
            </div>
        </div>
    )
}

export default Tag;