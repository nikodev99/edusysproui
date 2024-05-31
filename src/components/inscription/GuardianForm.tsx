import {ZodProps} from "../../utils/interfaces.ts";
import Responsive from "../ui/Responsive.tsx";
import Grid from "../ui/Grid.tsx";

const GuardianForm = ({control, errors}: ZodProps) => {
    return(
        <Responsive gutter={[16, 16]}>
            <Grid xs={24} md={12} lg={8}>

            </Grid>
        </Responsive>
    )
}

export default GuardianForm