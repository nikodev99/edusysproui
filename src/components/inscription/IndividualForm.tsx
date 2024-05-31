import Responsive from "../ui/Responsive.tsx";
import Grid from "../ui/Grid.tsx";
import {DatePicker, Form, Input, Select} from "antd";
import {Controller} from "react-hook-form";
import {ZodProps} from "../../utils/interfaces.ts";
import {useEffect, useMemo} from "react";
import {Gender} from "../../entity/enums/gender.ts";
import {enumToObjectArray} from "../../utils/utils.ts";
import dayjs from "dayjs";
import CountrySelect from "../ui/CountrySelect.tsx";

const IndividualForm = ({control, errors, validationTriggered}: ZodProps) => {

    const genderOptions = useMemo(() => enumToObjectArray(Gender), [])

    useEffect(() => {
        if (validationTriggered) {
            if (errors?.student?.lastName) {
                console.error(errors.student?.lastName.message)
            }
            if (errors.student?.firstName) {
               console.error(errors.student?.firstName.message);
            }
        }
    }, [errors, validationTriggered]);

    return (
        <Responsive gutter={[16, 16]}>
            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Nom(s) de Famille' required tooltip='requis' validateStatus={errors.student?.lastName ? 'error': ''} help={errors.student?.lastName ? errors.student?.lastName.message : ''}>
                    <Controller name='student.lastName' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='Malonga' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Prénom(s)' required tooltip='requis' validateStatus={errors.student?.firstName ? 'error': ''} help={errors.student?.firstName ? errors.student?.firstName.message : ''}>
                    <Controller name='student.firstName' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='Patrick' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Genre' required tooltip='requis' validateStatus={errors.student?.gender ? 'error': ''} help={errors.student?.gender ? errors.student?.gender.message : ''}>
                    <Controller name='student.gender' control={control} render={({field}) => (
                        <Select placeholder='Selectionner le genre' options={genderOptions} {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Date de Naissance' required tooltip='requis' validateStatus={errors.student?.birthDate ? 'error': ''} help={errors.student?.birthDate ? errors.student?.birthDate.message : ''}>
                    <Controller name="student.birthDate" control={control} defaultValue={undefined} render={({ field }) => (
                            <DatePicker {...field} format="DD/MM/YYYY" style={{width: '100%'}}
                                        onChange={(date) => field.onChange(date ? date.toDate() : null)}
                                        value={field.value ? dayjs(field.value) : null}
                            />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Lieux de Naissance' required tooltip='requis' validateStatus={errors.student?.birthCity ? 'error': ''} help={errors.student?.birthCity ? errors.student?.birthCity.message : ''}>
                    <Controller name='student.birthCity' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='Brazzaville' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <CountrySelect control={control} label='Nationalité' name='student.nationality' validateStatus={errors.student?.nationality ? 'error': ''} help={errors.student?.nationality ? errors.student?.nationality.message : ''} />
            </Grid>

            <Grid xs={24} md={12} lg={12}>
                <Form.Item label='Nom(s) et Prénom(s) du père' required tooltip='requis' validateStatus={errors.student?.dadName ? 'error': ''} help={errors.student?.dadName ? errors.student?.dadName.message : ''}>
                    <Controller name='student.dadName' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='Malonga Patrick' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={12}>
                <Form.Item label='Nom(s) et Prénom(s) de la mère' required tooltip='requis' validateStatus={errors.student?.momName ? 'error': ''} help={errors.student?.momName ? errors.student?.momName.message : ''}>
                    <Controller name='student.momName' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='Malonga Marie' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='E-mail' validateStatus={errors.student?.emailId ? 'error': ''} help={errors.student?.emailId ? errors.student?.emailId.message : ''}>
                    <Controller name='student.emailId' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='p.malonga@gmail.com' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Téléphone' validateStatus={errors.student?.telephone ? 'error': ''} help={errors.student?.telephone ? errors.student?.telephone.message : ''}>
                    <Controller name='student.telephone' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='060000000' {...field} />
                    )} />
                </Form.Item>
            </Grid>
        </Responsive>
    )
}

export default IndividualForm;