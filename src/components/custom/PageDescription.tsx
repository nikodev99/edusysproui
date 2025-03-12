import {ReactNode} from "react";
import {firstLetter} from "../../utils/utils.ts";

const PageDescription = (
    {title, description, count, isCount, addMargin = {size: '30px 0'}}: {
        title: ReactNode, description?: string, count?: number, isCount?: boolean
        addMargin?: {
            position?: "top" | "bottom" | "left" | "right",
            size?: number | string
        }
    }
) => {

    return(
        <header className='page__header' style={addMargin ? {[`margin${firstLetter(addMargin.position)}`]: addMargin.size} : undefined}>
            <div className='page__title' style={description ? {marginBottom: '20px'}: {}}>
                {isCount ? <h1>{count}<span className='count__title'>{title}</span></h1> : <h1>{title}</h1>}
            </div>
            {description && <div className='page__description'>
                <span>{description}</span>
            </div>}
        </header>
    )

}

export default PageDescription