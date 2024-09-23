import Responsive from "../ui/layout/Responsive.tsx";
import {Card} from "antd";
import Grid from "../ui/layout/Grid.tsx";
import {EnrollmentSchema, ZodProps} from "../../utils/interfaces.ts";
import ListInput from "../ui/form/ListInput.tsx";
import HealthCondition from "../forms/HealthConditionForm.tsx";

const HealthConditionForm = ({control, errors}: ZodProps<EnrollmentSchema>) => {

    return(
        <Responsive gutter={[16, 16]}>
            <HealthCondition control={control} errors={errors} edit={false} enroll={true} />

            <Grid xs={24} md={12} lg={8}>
                <Card style={{width: '100%', marginBottom: '20px'}}>
                    <ListInput name='conditions' control={control} label='Condition Medicale' zodProps={{control: control, name: 'student.healthCondition.medicalConditions'}} />
                </Card>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Card style={{width: '100%', marginBottom: '20px'}}>
                    <ListInput name='allergies' label='Allergie' zodProps={{control: control, name: 'student.healthCondition.allergies'}} />
                </Card>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Card style={{width: '100%', marginBottom: '20px'}}>
                    <ListInput name='medications' label='Medicament Obligatoire' zodProps={{control: control, name: 'student.healthCondition.medications'}} />
                </Card>
            </Grid>
        </Responsive>
    )
}

export default HealthConditionForm