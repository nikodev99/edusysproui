import '../ui.scss'
import BlockItem from "./BlockItem.tsx";
import {isValidElement, ReactNode} from "react";

interface BlockProps {
    items: ReactNode[]
}

const Block = ({items}: BlockProps) => {

    return(
        <div className='block-wrapper'>
            <div className='block-mansory'>
                {items.map((item, index) => {
                    if (isValidElement(item)) {
                        const { dataKey } = item.props;
                        return (<BlockItem key={`${dataKey}-${index}`} dataKey={`${dataKey}`} children={item} />)
                    }
                    return undefined
                })}
            </div>
        </div>
    )
}

export default Block;