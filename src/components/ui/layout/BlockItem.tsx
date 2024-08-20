import '../ui.scss'
import {ReactNode} from "react";

interface BlockItemProps {
    children: ReactNode;
    dataKey: string;
}

const BlockItem = ({children, dataKey}: BlockItemProps) => {
    return(
        <div className='block-item' key={dataKey}>
            {children}
        </div>
    )
}

export default BlockItem;