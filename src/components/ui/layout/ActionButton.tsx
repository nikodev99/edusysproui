import {AiOutlineEllipsis} from "react-icons/ai";
import {Dropdown} from "antd";
import {ItemType} from "antd/es/menu/interface";

const ActionButton = ({items, placement, arrow}: {
    items?: ItemType[],
    placement?: "bottomLeft" | "topLeft" | "topCenter" | "topRight" | "bottomCenter" | "bottomRight" | "top" | "bottom" | undefined
    arrow?: boolean
}) => {
    return(
        <Dropdown arrow={arrow} trigger={['click']} menu={{items: items}} placement={placement ? placement : 'bottomLeft'}>
            <div style={{cursor: 'pointer'}}>
                <AiOutlineEllipsis style={{fontWeight: 'bolder'}} size={30} />
            </div>
        </Dropdown>
    )
}

export default ActionButton