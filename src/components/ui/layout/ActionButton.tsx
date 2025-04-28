import {AiOutlineEllipsis} from "react-icons/ai";
import {Dropdown} from "antd";
import {ItemType} from "antd/es/menu/interface";
import {CSSProperties, ReactNode} from "react";

export const ActionButton = ({items, placement, arrow, icon, style, className}: {
    items?: ItemType[],
    placement?: "bottomLeft" | "topLeft" | "topCenter" | "topRight" | "bottomCenter" | "bottomRight" | "top" | "bottom" | undefined
    arrow?: boolean,
    icon?: ReactNode,
    style?: CSSProperties
    className?: string
}) => {
    return(
        <Dropdown arrow={arrow} trigger={['click']} menu={{items: items}} placement={placement ? placement : 'bottomLeft'}>
            <div style={{cursor: 'pointer' , ...style}} className={className}>
                {icon ? icon : <AiOutlineEllipsis style={{fontWeight: 'bolder'}} size={30} />}
            </div>
        </Dropdown>
    )
}