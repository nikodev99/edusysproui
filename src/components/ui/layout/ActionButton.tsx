import {AiOutlineEllipsis} from "react-icons/ai";
import {Dropdown, DropdownProps} from "antd";
import {ItemType} from "antd/es/menu/interface";
import {CSSProperties, ReactNode} from "react";

export const ActionButton = ({items, placement, arrow, icon, style, className, btnLabel, hasButton = true, trigger = ['click'], dropdownProps}: {
    items?: ItemType[],
    placement?: "bottomLeft" | "topLeft" | "topCenter" | "topRight" | "bottomCenter" | "bottomRight" | "top" | "bottom" | undefined
    arrow?: boolean,
    icon?: ReactNode,
    style?: CSSProperties
    className?: string
    btnLabel?: ReactNode
    dropdownProps?: DropdownProps
    trigger?: DropdownProps['trigger']
    hasButton?: boolean
}) => {
    return(
        <Dropdown arrow={arrow} trigger={trigger} menu={{items: items}} placement={placement ? placement : 'bottomLeft'} {...dropdownProps}>
            {hasButton && <div style={{cursor: 'pointer' , ...style}} className={className}>
                {icon ? icon : <AiOutlineEllipsis style={{fontWeight: 'bolder'}} size={30} />} {btnLabel && btnLabel}
            </div>}
        </Dropdown>
    )
}