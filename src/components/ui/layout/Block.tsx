import '../ui.scss'
import BlockItem from "./BlockItem.tsx";
import {ReactNode} from "react";

interface BlockProps {
    items: ReactNode[]
}

const Block = ({items}: BlockProps) => {

    return(
        <div className='block-wrapper'>
            <div className='block-mansory'>{items.map((item, index) => (<BlockItem key={index} children={item} />))}</div>
        </div>
    )
}

export default Block;