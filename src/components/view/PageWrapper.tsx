import React, {ReactNode} from "react";
import {Color} from "@/core/utils/interfaces.ts";

const PageWrapper = ({children, classNameList, background, styles}: {
    children: ReactNode,
    classNameList?: string,
    background?: Color,
    styles?: React.CSSProperties
}) => {
    return (
        <section
            className={`page-wrapper ${classNameList}`}
            style={background ? {...styles, background: background}: styles}>
            {children}
        </section>
    )
}

export default PageWrapper