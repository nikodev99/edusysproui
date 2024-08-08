import '../ui.scss'
import {ReactNode} from "react";

interface BlockItemProps {
    children: ReactNode;
}

const BlockItem = ({children}: BlockItemProps) => {
    return(
        <div className='block-item'>
            {children}
        </div>
    )
}

export default BlockItem;