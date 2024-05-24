import Responsive from "../ui/Responsive.tsx";
import Grid from "../ui/Grid.tsx";
import {DatePicker, Form, Input, Select} from "antd";
import {Controller} from "react-hook-form";
import {ZodProps} from "../../utils/interfaces.ts";
import {useEffect, useMemo} from "react";
import {Gender} from "../../entity/enums/gender.ts";
import {enumToObjectArray} from "../../utils/utils.ts";
import countryList from 'react-select-country-list'

const IndividualForm = ({control, errors, validationTriggered}: ZodProps) => {

    const countryOptions = useMemo(() => countryList().getData(), [])

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
                    <Form.Item label='Nom(s) de Famille' required tooltip='requis' validateStatus={errors.lastName ? 'error': ''} help={errors.lastName ? errors.lastName.message : ''}>
                        <Controller name='lastName' control={control} defaultValue='' render={({field}) => (
                            <Input placeholder='Malonga' {...field} />
                        )} />
                    </Form.Item>
                </Grid>

                <Grid xs={24} md={12} lg={8}>
                    <Form.Item label='Prénom(s)' required tooltip='requis' validateStatus={errors.firstName ? 'error': ''} help={errors.firstName ? errors.firstName.message : ''}>
                        <Controller name='firstName' control={control} defaultValue='' render={({field}) => (
                            <Input placeholder='Patrick' {...field} />
                        )} />
                    </Form.Item>
                </Grid>

                <Grid xs={24} md={12} lg={8}>
                    <Form.Item label='Genre' required tooltip='requis' validateStatus={errors.gender ? 'error': ''} help={errors.gender ? errors.gender.message : ''}>
                        <Controller name='gender' control={control} defaultValue='HOMME' render={({field}) => (
                            <Select defaultValue={{value: 0, label: 'HOMME'}} options={enumToObjectArray(Gender)} {...field} />
                        )} />
                    </Form.Item>
                </Grid>

                <Grid xs={24} md={12} lg={8}>
                    <Form.Item label='Date de Naissance' required tooltip='requis' validateStatus={errors.birthDate ? 'error': ''} help={errors.birthDate ? errors.birthDate.message : ''}>
                        <Controller name='birthDate' control={control} defaultValue={undefined} render={({field}) => (
                            <DatePicker format='DD/MM/YYYY' style={{width: '100%'}} {...field} />
                        )} />
                    </Form.Item>
                </Grid>

                <Grid xs={24} md={12} lg={8}>
                    <Form.Item label='Lieux de Naissance' required tooltip='requis' validateStatus={errors.birthCity ? 'error': ''} help={errors.birthCity ? errors.birthCity.message : ''}>
                        <Controller name='birthCity' control={control} defaultValue='' render={({field}) => (
                            <Input placeholder='Brazzaville' {...field} />
                        )} />
                    </Form.Item>
                </Grid>

                <Grid xs={24} md={12} lg={8}>
                    <Form.Item label='Nationalité' required tooltip='requis' validateStatus={errors.nationality ? 'error': ''} help={errors.nationality ? errors.nationality.message : ''}>
                        <Controller name='nationality' control={control} defaultValue='Congo' render={({field}) => (
                            <Select options={countryOptions} {...field} />
                        )} />
                    </Form.Item>
                </Grid>

                <Grid xs={24} md={12} lg={12}>
                    <Form.Item label='Nom(s) et Prénom(s) du père' required tooltip='requis' validateStatus={errors.dadName ? 'error': ''} help={errors.dadName ? errors.dadName.message : ''}>
                        <Controller name='dadName' control={control} defaultValue='' render={({field}) => (
                            <Input placeholder='Malonga Patrick' {...field} />
                        )} />
                    </Form.Item>
                </Grid>

                <Grid xs={24} md={12} lg={12}>
                    <Form.Item label='Nom(s) et Prénom(s) de la mère' required tooltip='requis' validateStatus={errors.momName ? 'error': ''} help={errors.momName ? errors.momName.message : ''}>
                        <Controller name='momName' control={control} defaultValue='' render={({field}) => (
                            <Input placeholder='Malonga Marie' {...field} />
                        )} />
                    </Form.Item>
                </Grid>

                <Grid xs={24} md={12} lg={8}>
                    <Form.Item label='E-mail' validateStatus={errors.momName ? 'error': ''} help={errors.momName ? errors.momName.message : ''}>
                        <Controller name='momName' control={control} defaultValue='' render={({field}) => (
                            <Input placeholder='Malonga Marie' {...field} />
                        )} />
                    </Form.Item>
                </Grid>

                <Grid xs={24} md={12} lg={8}>
                    <Form.Item label='Téléphone' validateStatus={errors.momName ? 'error': ''} help={errors.momName ? errors.momName.message : ''}>
                        <Controller name='momName' control={control} defaultValue='' render={({field}) => (
                            <Input placeholder='Malonga Marie' {...field} />
                        )} />
                    </Form.Item>
                </Grid>
            </Responsive>
        </>
    )
}

export default IndividualForm;