import Responsive from "./Responsive.tsx";
import Grid from "./Grid.tsx";
import {WidgetItem, WidgetProps} from "@/core/utils/interfaces.ts";
import {Widget} from "./Widget.tsx";

export const Widgets = ({items, hasShadow, responsiveness = false}: WidgetProps) => {
    return(
        <>
            {
                responsiveness
                    ? (
                        items.map((item: WidgetItem, index: number) => (
                            <Grid xs={24} md={12} lg={6} key={index}>
                                <Widget {...item} hasShadow={hasShadow} />
                            </Grid>)
                        )
                    )
                    : (
                        <Responsive gutter={[16, 16]}>
                            {items.map((item: WidgetItem, index: number) => (
                                <Grid xs={24} md={12} lg={6} key={index}>
                                    <Widget {...item} hasShadow={hasShadow} />
                                </Grid>
                            ))}
                        </Responsive>
                    )
            }
        </>

    )
}