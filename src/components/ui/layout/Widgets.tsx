import {Card, Statistic} from "antd";
import Responsive from "./Responsive.tsx";
import Grid from "./Grid.tsx";
import {WidgetItem, WidgetProps} from "../../../utils/interfaces.ts";

export const Widgets = ({items}: WidgetProps) => {
    return(
        <Responsive gutter={[16, 16]}>
            {items.map((item: WidgetItem, index: number) => (
                <Grid xs={24} md={12} lg={6} key={index}>
                    <Card bordered={false} style={{height: '130px'}}>
                        <Statistic
                            title={item.title}
                            value={item.value}
                            precision={item.precision}
                            valueStyle={item.valueStyle}
                            prefix={item.prefix}
                            suffix={item.suffix}
                        />
                        {item.bottomValue}
                    </Card>
                </Grid>
            ))}
        </Responsive>
    )
}