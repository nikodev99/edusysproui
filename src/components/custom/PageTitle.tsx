import Responsive from "../ui/layout/Responsive.tsx";
import Grid from "../ui/layout/Grid.tsx";
import {ReactNode} from "react";
import {Typography} from "antd";

export const PageTitle = ({title, description}: {title?: ReactNode, description?: ReactNode}) => {
    const {Title} = Typography
    return(
        <section style={ {margin: '20px 0 30px 0'}}>
            <Title level={3} style={{color: '#333'}}>{title}</Title>
            <Responsive gutter={[16, 16]}>
                <Grid xs={24} md={12} lg={12} style={{color: '#666'}}>
                    {description}
                </Grid>
            </Responsive>
        </section>
    )
}