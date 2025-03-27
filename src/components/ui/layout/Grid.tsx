import {Col, ColProps} from "antd";
import {fontFamily} from "../../../core/utils/utils.ts";

const Grid = (gridProps: ColProps) => {

    const { style } = gridProps;
    const mergedStyle = { ...style, fontFamily };

    return(
        <Col {...gridProps} style={mergedStyle}>
            {gridProps.children}
        </Col>
    )
}

export default Grid