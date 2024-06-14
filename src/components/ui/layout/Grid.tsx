import {Col, ColProps} from "antd";
import {fontFamily} from "../../../utils/utils.ts";

const Grid = ({xs, sm, md, lg, xl, xxl, push, pull, flex, children, span, style, className}: ColProps) => {

    const cssStyle = {...style, fontFamily: fontFamily}

    return(
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl} push={push} pull={pull} flex={flex} span={span} style={cssStyle} className={className}>
            {children}
        </Col>
    )
}

export default Grid