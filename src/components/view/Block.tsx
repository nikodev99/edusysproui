import '../ui/ui.scss'
import BlockItem from "../ui/layout/BlockItem.tsx";
import {isValidElement, ReactNode} from "react";
import Masonry, {ResponsiveMasonry} from "react-masonify";

interface BlockProps {
    items: ReactNode[]
}

const Block = ({items}: BlockProps) => {

    return(
        <ResponsiveMasonry columnsCountBreakPoints={{350:1, 750:2, 1100:3, 2000:4}}>
            <Masonry gap='20px' itemTag='section'>
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