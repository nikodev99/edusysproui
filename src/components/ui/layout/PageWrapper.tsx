import {ReactNode} from "react";

const PageWrapper = ({children}: {children: ReactNode}) => {
    return (
        <section className='page-wrapper'>{children}</section>
    )
}

export default PageWrapper