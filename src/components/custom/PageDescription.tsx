import {ReactNode} from "react";

const PageDescription = ({title, description, count, isCount}: {title: ReactNode, description?: string, count?: number, isCount?: boolean}) => {

    return(
        <header className='page__header'>
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