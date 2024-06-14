import {Row, RowProps} from "antd";

const Responsive = ({align, gutter, justify, wrap, children}: RowProps) => {
    return(
        <Row align={align ? align : 'top'} justify={justify ? justify : 'start'} wrap={wrap ? wrap : true} gutter={gutter ? gutter : 0}>
            {children}
        </Row>
    )
}

export default Responsive;