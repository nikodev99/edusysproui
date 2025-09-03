import {ReactNode} from "react";
import {Color} from "../../core/utils/interfaces.ts";

const PageWrapper = ({children, classNameList, background}: {children: ReactNode, classNameList?: string, background?: Color}) => {
    return (
        <section
            className={`page-wrapper ${classNameList}`}
            style={background ? {background: background}: undefined}>
            {children}
        </section>
    )
}

export default PageWrapper