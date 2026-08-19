import {AiOutlineEllipsis} from "react-icons/ai";
import {Dropdown, DropdownProps} from "antd";
import {ItemType} from "antd/es/menu/interface";
import {CSSProperties, ReactNode} from "react";
import {MAIN_COLOR} from "@/core/utils/utils.ts";

export const ActionButton = ({idKey, items, placement, arrow, icon, style, className, btnLabel, hasButton = true, specialStyle = true, trigger = ['click'], dropdownProps, onSelect}: {
    idKey?: string,
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
    onSelect?: (key: string) => void
    specialStyle?: boolean
}) => {
    return(
        <Dropdown
            arrow={arrow} trigger={trigger} menu={{ items: items }} placement={placement ? placement : 'bottomLeft'}
            destroyOnHidden {...dropdownProps}
        >
            {hasButton && <span
                style={specialStyle ? {
                    width: 34, height: 34, borderRadius: "50%", display: "flex",
                    alignItems: "center", justifyContent: "center", gap: 3,
                    color: '#fff', background: MAIN_COLOR
                }: style}
                className={className} onClick={idKey && onSelect ? () => onSelect?.(idKey as string): undefined}
            >
                {icon ? icon : <AiOutlineEllipsis style={{fontWeight: 'bolder'}} size={30} />} {btnLabel && btnLabel}
            </span>}
        </Dropdown>
    )
}