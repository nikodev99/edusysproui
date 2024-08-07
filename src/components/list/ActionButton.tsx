import {AiOutlineEllipsis} from "react-icons/ai";
import {Dropdown} from "antd";
import {ItemType} from "antd/es/menu/hooks/useItems";

const ActionButton = ({items, placement}: {items?: ItemType[], placement?: "bottomLeft" | "topLeft" | "topCenter" | "topRight" | "bottomCenter" | "bottomRight" | "top" | "bottom" | undefined}) => {
    return(
        <Dropdown trigger={['click']} menu={{items: items}} placement={placement ? placement : 'bottomLeft'}>
            <div style={{cursor: 'pointer'}}>
                <AiOutlineEllipsis style={{fontWeight: 'bolder'}} size={30} />
            </div>
        </Dropdown>
    )
}

export default ActionButton