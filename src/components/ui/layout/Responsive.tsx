import {Row, RowProps} from "antd";

const Responsive = (responsiveProps: RowProps) => {
    return(
        <Row {...responsiveProps}>
            {responsiveProps.children}
        </Row>
    )
}

export default Responsive;