import {ReactNode} from "react";
import '../ui.scss'
import {LuBadgeAlert, LuBadgeCheck, LuClock4} from "react-icons/lu";
import {Color} from "../../../core/utils/interfaces.ts";

interface TagProps {
    children?: ReactNode;
    color?: 'success' | 'warning' | 'danger' | 'processing' | Color;
    icon?: ReactNode;
    textColor?: Color;
}

const Tag = ({color, children, icon, textColor}: TagProps) => {

    let customIcon: ReactNode;

    switch(color) {
        case 'success':
            customIcon = <LuBadgeCheck />
            break
        case 'danger':
            customIcon = <LuBadgeAlert />
            break
        case 'warning':
            customIcon = <LuClock4 />
            break
        default:
            customIcon = <LuClock4 />

    }

    const isOtherColor = color && color !== 'success' && color !== 'danger' && color !== 'warning' && color !== 'processing'

    return (
        <div
            className={`tag__wrapper ${isOtherColor ? '' : color}`}
            style={isOtherColor ? {backgroundColor: color} : undefined}
        >
            <div className='tagged' style={textColor ? {color: textColor} : undefined}>
                {icon ? icon : customIcon}
                {children}
            </div>
        </div>
    )
}

export default Tag;