import Responsive from "../ui/layout/Responsive.tsx";
import {Card, Form, InputNumber, Select} from "antd";
import {Controller} from "react-hook-form";
import Grid from "../ui/layout/Grid.tsx";
import {ZodProps} from "../../utils/interfaces.ts";
import {BloodType} from "../../entity/enums/bloodType.ts";
import ListInput from "../ui/form/ListInput.tsx";

const HealthConditionForm = ({control, errors, }: ZodProps,) => {

    return(
        <Responsive gutter={[16, 16]}>
            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Groupe Sanguin' required tooltip='requis' validateStatus={errors.student?.healthCondition?.bloodType ? 'error': ''} help={errors.student?.healthCondition?.bloodType ? errors.student?.healthCondition?.bloodType.message : ''}>
                    <Controller name='student.healthCondition.bloodType' control={control} render={({field}) => (
                        <Select options={[
                            {value: BloodType.A, label: 'A+'},
                            {value: BloodType.A_, label: 'A-'},
                            {value: BloodType.B, label: 'B+'},
                            {value: BloodType.B_, label: 'B-'},
                            {value: BloodType.AB, label: 'AB+'},
                            {value: BloodType.AB_, label: 'AB-'},
                            {value: BloodType.O, label: 'O+'},
                            {value: BloodType.O_, label: 'O-'},
                        ]} placeholder='Selectionez le groupe sanguin' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Poids' required tooltip='requis' validateStatus={errors.student?.healthCondition?.weight ? 'error': ''} help={errors.student?.healthCondition?.weight ? errors.student?.healthCondition?.weight.message : ''}>
                    <Controller name='student.healthCondition.weight' control={control} defaultValue={0} render={({field}) => (
                        <InputNumber min={0} style={{width: '100%'}} addonAfter='Kg' placeholder='100' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Taille' required tooltip='requis' validateStatus={errors.student?.healthCondition?.height ? 'error': ''} help={errors.student?.healthCondition?.height ? errors.student?.healthCondition?.height.message : ''}>
                    <Controller name='student.healthCondition.height' control={control} defaultValue={0} render={({field}) => (
                        <InputNumber  min={0} style={{width: '100%'}} addonAfter='cm' placeholder='167' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Card style={{width: '100%', marginBottom: '20px'}}>
                    <ListInput name='conditions' label='Condition Medicale' zodProps={{control: control, name: 'student.healthCondition.medicalConditions'}} />
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