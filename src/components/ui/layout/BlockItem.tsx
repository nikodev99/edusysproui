import '../ui.scss'
import {CSSProperties, ReactNode} from "react";

interface BlockItemProps {
    children: ReactNode;
    dataKey?: string;
    style?: CSSProperties
}

const BlockItem = ({children, dataKey, style}: BlockItemProps) => {
    return(
        <div className='block-item' key={dataKey} style={style}>
            {children}
        </div>
    )
}

export default BlockItem;