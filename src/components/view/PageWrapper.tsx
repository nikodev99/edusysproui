import {ReactNode} from "react";

const PageWrapper = ({children, classNameList}: {children: ReactNode, classNameList?: string}) => {
    return (
        <section className={`page-wrapper ${classNameList}`}>{children}</section>
    )
}

export default PageWrapper