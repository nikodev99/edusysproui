import '../ui.scss'
import BlockItem from "./BlockItem.tsx";
import {isValidElement, ReactNode} from "react";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";

interface BlockProps {
    items: ReactNode[]
}

const Block = ({items}: BlockProps) => {

    return(
        <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3, 1680: 4}}>
            <Masonry gutter='1em'>
                {items.map((item, index) => {
                    if (isValidElement(item)) {
                        const { dataKey } = item.props;
                        return (<BlockItem key={`${dataKey}-${index}`} dataKey={`${dataKey}`} children={item} />)
                    }
                    return undefined
                })}
            </Masonry>
        </ResponsiveMasonry>
    )
}

export default Block;