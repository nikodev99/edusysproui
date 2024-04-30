import Responsive from "../../components/ui/Responsive.tsx";
import Grid from "../../components/ui/Grid.tsx";

const Inscription = () => {

    return(
        <Responsive>
            <Grid xs={24} lg={6} style={{background: 'red'}}>col1</Grid>
            <Grid xs={24} lg={6} style={{background: 'yellow'}}>col2</Grid>
            <Grid xs={24} lg={6} style={{background: 'purple'}}>col3</Grid>
            <Grid xs={24} lg={6} style={{background: 'blue'}}>col4</Grid>
        </Responsive>
    )
}

export default Inscription