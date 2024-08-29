import Responsive from "../ui/layout/Responsive.tsx";
import Grid from "../ui/layout/Grid.tsx";
import Widget from "../ui/layout/Widget.tsx";
import {AttendanceRecord} from "../../utils/interfaces.ts";

const AttendanceAnalysis = ({data}: {data: AttendanceRecord[]}) => {

    console.log('stat: ', data)

    return (
        <Responsive gutter={[16, 16]} className='attendance-analysis'>
            <Grid xs={24} md={24} lg={24}>
                <Responsive gutter={[16, 16]}>
                    <Grid xs={24} md={8} lg={6}>
                        <Widget title='Total Jours Present' data={data} />
                    </Grid>
                    <Grid xs={24} md={8} lg={6}><Widget /></Grid>
                    <Grid xs={24} md={8} lg={6}><Widget /></Grid>
                    <Grid xs={24} md={8} lg={6}><Widget /></Grid>
                </Responsive>
            </Grid>
            <Grid xs={24} md={12} lg={8}>2</Grid>
            <Grid xs={24} md={12} lg={8}>3</Grid>
            <Grid xs={24} md={12} lg={8}>4</Grid>
            <Grid xs={24} md={12} lg={8}>5</Grid>
            <Grid xs={24} md={12} lg={8}>6</Grid>
            <Grid xs={24} md={12} lg={8}>7</Grid>
            <Grid xs={24} md={12} lg={8}>8</Grid>
        </Responsive>
    )
}

export default AttendanceAnalysis