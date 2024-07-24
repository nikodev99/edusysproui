import Responsive from "../ui/layout/Responsive.tsx";
import Grid from "../ui/layout/Grid.tsx";

const StudentInfo = () => {
    return(
        <Responsive gutter={[16, 16]}>
            <Grid xs={24} md={12} lg={8} style={{height: '1800px'}}></Grid>
            <Grid xs={24} md={12} lg={8} style={{height: '1800px'}}></Grid>
            <Grid xs={24} md={12} lg={8} style={{height: '1800px'}}></Grid>
        </Responsive>
    )
}

export default StudentInfo