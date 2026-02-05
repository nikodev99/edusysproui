import {ReactNode} from "react";
import {firstLetter} from "@/core/utils/utils.ts";

const PageDescription = (
    {title, description, count, isCount, addMargin = {size: '0'}}: {
        title: ReactNode, description?: ReactNode, count?: number, isCount?: boolean
        addMargin?: {
            position?: "top" | "bottom" | "left" | "right",
            size?: number | string
        }
    }
) => {

    return(
        <header className='page__header' style={addMargin ? {[`margin${firstLetter(addMargin.position)}`]: addMargin.size} : undefined}>
            <div className='page__title'>
                {isCount ? <h1>{count}<span className='count__title'>{title}</span></h1> : <h1>{title}</h1>}
            </div>
            {description && <div className='page__description'>
                <div>{description}</div>
            </div>}
        </header>
    )

}

export default PageDescription