import {AiOutlineEllipsis} from "react-icons/ai";
import {Dropdown} from "antd";
import {ItemType} from "antd/es/menu/interface";
import {ReactNode} from "react";

const ActionButton = ({items, placement, arrow, icon}: {
    items?: ItemType[],
    placement?: "bottomLeft" | "topLeft" | "topCenter" | "topRight" | "bottomCenter" | "bottomRight" | "top" | "bottom" | undefined
    arrow?: boolean,
    icon?: ReactNode
}) => {
    return(
        <Dropdown arrow={arrow} trigger={['click']} menu={{items: items}} placement={placement ? placement : 'bottomLeft'}>
            <div style={{cursor: 'pointer'}}>
                {icon ? icon : <AiOutlineEllipsis style={{fontWeight: 'bolder'}} size={30} />}
            </div>
        </Dropdown>
    )
}

export default ActionButton