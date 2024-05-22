import Responsive from "../ui/Responsive.tsx";
import Grid from "../ui/Grid.tsx";
import {Form, Input} from "antd";
import {Controller} from "react-hook-form";
import {ZodProps} from "../../utils/interfaces.ts";
import {useEffect} from "react";

const IndividualForm = ({control, errors, validationTriggered}: ZodProps) => {

    useEffect(() => {
        if (validationTriggered) {
            if (errors.lastName) {
                console.error(errors.lastName.message)
            }
            if (errors.firstName) {
               console.error(errors.firstName.message);
            }
        }
    }, [errors, validationTriggered]);

    return (
        <>
            <Responsive gutter={[16, 16]}>
                <Grid xs={24} md={12} lg={8}>
                    <Form.Item label='Nom de Famille' required tooltip='requis' validateStatus={errors.lastName ? 'error': ''} help={errors.lastName ? errors.lastName.message : ''}>
                        <Controller name='lastName' control={control} defaultValue='' render={({field}) => (
                            <Input placeholder='Malonga' {...field} />
                        )} />
                    </Form.Item>
                </Grid>
                <Grid xs={24} md={12} lg={8}>
                    <Form.Item label='Prénom' required tooltip='requis' validateStatus={errors.firstName ? 'error': ''} help={errors.firstName ? errors.firstName.message : ''}>
                        <Controller name='firstName' control={control} defaultValue='' render={({field}) => (
                            <Input placeholder='Patrick' {...field} />
                        )} />
                    </Form.Item>
                </Grid>
            </Responsive>
        </>
    )
}

export default IndividualForm;