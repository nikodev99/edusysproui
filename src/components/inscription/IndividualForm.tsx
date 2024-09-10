import Responsive from "../ui/layout/Responsive.tsx";
import Grid from "../ui/layout/Grid.tsx";
import {DatePicker, Form, Input, Select} from "antd";
import {Controller} from "react-hook-form";
import {ZodProps} from "../../utils/interfaces.ts";
import {useEffect, useMemo} from "react";
import {Gender} from "../../entity/enums/gender.ts";
import {enumToObjectArray} from "../../utils/utils.ts";
import dayjs from "dayjs";
import CountrySelect from "../ui/form/CountrySelect.tsx";
import {Student} from "../../entity";
import TextInput from "../ui/form/TextInput.tsx";
import SelectInput from "../ui/form/SelectInput.tsx";

interface IndividualProps extends ZodProps {
    edit?: boolean
    data?: Student
}

const IndividualForm = ({control, errors, validationTriggered, edit, data}: IndividualProps) => {

    const genderOptions = useMemo(() => enumToObjectArray(Gender), [])

    useEffect(() => {
        if (validationTriggered) {
            if (errors?.student?.lastName) {
                console.error(errors.student?.lastName.message)
            }
            if (errors?.student?.firstName) {
               console.error(errors?.student?.firstName.message);
            }
        }
    }, [errors, validationTriggered]);

    const onlyField = edit ? 24 : undefined
    const value = edit && data ? data.lastName : undefined

    console.log('Last Name Value', value)

    return (
        <Responsive gutter={[16, 16]}>
            <TextInput
                isCompact={edit}
                md={onlyField}
                lg={onlyField}
                label='Nom(s) de Famille'
                control={control}
                name='student.lastName'
                required
                defaultValue={edit && data ? data.lastName : ''}
                placeholder='Malonga'
                validateStatus={errors?.student?.lastName ? 'error' : ''}
                help={errors?.student?.lastName ? errors?.student?.lastName.message : ''}
            />
            <TextInput
                isCompact={edit}
                md={onlyField}
                lg={onlyField}
                label='Prénom(s)'
                control={control}
                name='student.firstName'
                required
                defaultValue={edit && data ? data.firstName : ''}
                placeholder='Patrick'
                validateStatus={errors?.student?.firstName ? 'error': ''}
                help={errors?.student?.firstName ? errors?.student?.firstName.message : ''}
            />
            <TextInput
                isCompact={edit}
                md={onlyField}
                lg={onlyField}
                label='Prénom(s)'
                control={control}
                name='student.firstName'
                required
                defaultValue={edit && data ? data.firstName : ''}
                placeholder='Patrick'
                validateStatus={errors?.student?.firstName ? 'error': ''}
                help={errors?.student?.firstName ? errors?.student?.firstName.message : ''}
            />

            <SelectInput
                options={genderOptions}
                name='student.gender'
                label='Gender'
                control={control}
                required
                validateStatus={errors?.student?.gender ? 'error': ''}
                help={errors?.student?.gender ? errors?.student?.gender.message : ''}
                isCompact={edit}
                placeholder='Selectionner le genre'
                md={onlyField}
                lg={onlyField}
                selectedValue={edit && data ? data.gender : undefined}
            />

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Date de Naissance' required tooltip='requis' validateStatus={errors?.student?.birthDate ? 'error': ''} help={errors?.student?.birthDate ? errors?.student?.birthDate.message : ''}>
                    <Controller name="student.birthDate" control={control} defaultValue={undefined} render={({ field }) => (
                            <DatePicker {...field} format="DD/MM/YYYY" style={{width: '100%'}}
                                        onChange={(date) => field.onChange(date ? date.toDate() : null)}
                                        value={field.value ? dayjs(field.value) : null}
                            />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Lieux de Naissance' required tooltip='requis' validateStatus={errors?.student?.birthCity ? 'error': ''} help={errors?.student?.birthCity ? errors?.student?.birthCity.message : ''}>
                    <Controller name='student.birthCity' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='Brazzaville' {...field} />
                    )} />
                </Form.Item>

            </Grid>
            <Grid xs={24} md={12} lg={8}>
                <CountrySelect control={control} label='Nationalité' name='student.nationality' validateStatus={errors?.student?.nationality ? 'error': ''} help={errors?.student?.nationality ? errors?.student?.nationality.message : ''} />
            </Grid>

            <Grid xs={24} md={12} lg={12}>
                <Form.Item label='Nom(s) et Prénom(s) du père' required tooltip='requis' validateStatus={errors?.student?.dadName ? 'error': ''} help={errors?.student?.dadName ? errors?.student?.dadName.message : ''}>
                    <Controller name='student.dadName' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='Malonga Patrick' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={12}>
                <Form.Item label='Nom(s) et Prénom(s) de la mère' required tooltip='requis' validateStatus={errors?.student?.momName ? 'error': ''} help={errors?.student?.momName ? errors?.student?.momName.message : ''}>
                    <Controller name='student.momName' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='Malonga Marie' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='E-mail' validateStatus={errors?.student?.emailId ? 'error': ''} help={errors?.student?.emailId ? errors?.student?.emailId.message : ''}>
                    <Controller name='student.emailId' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='p.malonga@gmail.com' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Téléphone' validateStatus={errors?.student?.telephone ? 'error': ''} help={errors?.student?.telephone ? errors?.student?.telephone.message : ''}>
                    <Controller name='student.telephone' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='060000000' {...field} />
                    )} />
                </Form.Item>
            </Grid>
        </Responsive>
    )
}

export default IndividualForm;