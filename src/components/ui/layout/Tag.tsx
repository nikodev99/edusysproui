import {ReactNode} from "react";
import '../ui.scss'
import {LuBadgeAlert, LuBadgeCheck, LuClock4} from "react-icons/lu";

interface TagProps {
    children?: ReactNode;
    color?: 'success' | 'warning' | 'danger' | 'processing';
    icon?: ReactNode;
}

const Tag = ({color, children, icon}: TagProps) => {

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

    return (
        <div className={`tag__wrapper ${color}`}>
            <div className='tagged'>
                {icon ? icon : customIcon}
                {children}
            </div>
        </div>
    )
}

export default Tag;